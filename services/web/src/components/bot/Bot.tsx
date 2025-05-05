/*
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from "react";

import config from "./config";
import { APIService } from "../../constants/APIConstant";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import Chatbot from "react-chatbot-kit";
import { Row, Col } from "antd";
import { Space } from "antd";
import Icon, {
  CloseSquareOutlined,
  DeleteOutlined,
  WechatWorkOutlined,
} from "@ant-design/icons";
import "./chatbot.css";

const superagent = require("superagent");

const PandaSvg = (): JSX.Element => (
  <svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path
      d="M437.333,21.355H74.667C33.493,21.355,0,54.848,0,96.021v213.333c0,41.173,33.493,74.667,74.667,74.667h48.256    l-36.821,92.032c-1.771,4.395-0.405,9.429,3.328,12.352c1.92,1.515,4.245,2.283,6.592,2.283c2.176,0,4.352-0.661,6.208-1.984    l146.56-104.683h188.587c41.173,0,74.667-33.493,74.667-74.667V96.021C512,54.848,478.507,21.355,437.333,21.355z"
      fill="#1890FF"
    />
  </svg>
);

const ChatIcon = ({ size = "26pt" }: { size?: string | number }) => (
  <WechatWorkOutlined style={{ fontSize: size }} />
);

interface ChatBotState {
  openapiKey: string | null;
  initializing: boolean;
  initializationRequired: boolean;
  accessToken: string;
  isLoggedIn: boolean;
  role: string;
}

interface ChatBotComponentProps {
  accessToken: string;
  isLoggedIn: boolean;
  role: string;
}

const ChatBotComponent: React.FC<ChatBotComponentProps> = (props) => {
  const [chatbotState, setChatbotState] = useState<ChatBotState>({
    openapiKey: localStorage.getItem("openapi_key"),
    initializing: false,
    initializationRequired: false,
    accessToken: props.accessToken,
    isLoggedIn: props.isLoggedIn,
    role: props.role,
  });

  const [showBot, toggleBot] = useState<boolean>(false);

  const headerText = (): JSX.Element => {
    return (
      <div
        style={{
          backgroundColor: "#04AA6D",
          color: "white",
          padding: "1px",
          borderRadius: "1px",
        }}
      >
        <Space style={{ margin: "5px" }}>
          &nbsp; &nbsp; Exploit CrapBot &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp;
          <a
            style={{
              color: "white",
              fontWeight: "bold",
              background: "#0a5e9c",
              borderRadius: "0px",
            }}
            href="##"
            onClick={(e) => {
              e.preventDefault();
              toggleBot((prev) => !prev);
            }}
          >
            <CloseSquareOutlined style={{ margin: "2px" }} />
          </a>
        </Space>
      </div>
    );
  };

  useEffect(() => {
    const fetchInit = async () => {
      const stateUrl = APIService.CHATBOT_SERVICE + "genai/state";
      let initRequired = false;
      // Wait for the response
      await superagent
        .post(stateUrl)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${props.accessToken}`)
        .then((res: any) => {
          console.log("I response:", res.body);
          if (res.status === 200) {
            if (res.body?.initialized === "true") {
              initRequired = false;
            } else {
              initRequired = true;
            }
          }
        })
        .catch((err: any) => {
          console.log("Error prefetch: ", err);
        });
      console.log("Initialization required:", initRequired);
      setChatbotState((prev) => ({
        ...prev,
        initializationRequired: initRequired,
      }));
    };
    fetchInit();
  }, []);

  const config_chatbot = {
    ...config,
    customComponents: {
      header: headerText,
      botAvatar: () => (
        <Icon
          component={PandaSvg}
          className="app-chatbot-button-icon"
          style={{ fontSize: "40", color: "white" }}
        />
      ),
    },
    state: chatbotState,
  };

  const saveMessages = (messages: any[]): void => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  const loadMessages = (): any[] => {
    const messages = JSON.parse(localStorage.getItem("chat_messages") || "[]");
    return messages;
  };

  const clearHistory = (): void => {
    localStorage.removeItem("chat_messages");
  };

  console.log("Config state", config_chatbot);
  return (
    <Row>
      <Col xs={10}>
        <div className="app-chatbot-container">
          <div style={{ maxWidth: "500px" }}>
            {showBot && (
              <Chatbot
                config={config_chatbot}
                actionProvider={ActionProvider}
                messageParser={MessageParser}
                saveMessages={saveMessages}
                messageHistory={loadMessages()}
                placeholderText={"Type something..."}
              />
            )}
            <button
              className="app-chatbot-button"
              onClick={() => toggleBot((prev) => !prev)}
            >
              <ChatIcon />
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ChatBotComponent;
