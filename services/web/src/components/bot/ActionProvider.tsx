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

import { APIService } from "../../constants/APIConstant";
// import { isAccessTokenValid } from "../../utils";
import superagent from "superagent";

interface ChatBotMessage {
  id: string;
  message: string;
  loading?: boolean;
  terminateLoading?: boolean;
}

interface State {
  messages: ChatBotMessage[];
  openapiKey: string | null;
  initializing: boolean;
  initializationRequired: boolean;
}

type SetStateFunc = (stateUpdater: (state: State) => State) => void;

class ActionProvider {
  private createChatBotMessage: (
    message: string,
    options?: Partial<ChatBotMessage>,
  ) => ChatBotMessage;
  private setState: SetStateFunc;
  private createClientMessage: (message: string) => ChatBotMessage;

  constructor(
    createChatBotMessage: (
      message: string,
      options?: Partial<ChatBotMessage>,
    ) => ChatBotMessage,
    setStateFunc: SetStateFunc,
    createClientMessage: (message: string) => ChatBotMessage,
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  handleNotInitialized = (): void => {
    const message = this.createChatBotMessage(
      "To initialize the chatbot, please type init and press enter.",
      {
        loading: true,
        terminateLoading: true,
      },
    );
    this.addMessageToState(message);
  };

  handleInitialize = (initRequired: boolean): void => {
    console.log("Initialization required:", initRequired);
    if (initRequired) {
      this.addOpenApiKeyToState(null);
      this.addInitializingToState();
      const message = this.createChatBotMessage(
        "Please type your OpenAI API key and press enter.",
        {
          loading: true,
          terminateLoading: true,
        },
      );
      this.addMessageToState(message);
    } else {
      const message = this.createChatBotMessage("Bot already initialized", {
        loading: true,
        terminateLoading: true,
      });
      this.addMessageToState(message);
    }
  };

  handleInitialized = (apiKey: string | null, accessToken: string): void => {
    if (!apiKey) {
      const message = this.createChatBotMessage(
        "Please enter a valid OpenAI API key.",
        {
          loading: true,
          terminateLoading: true,
        },
      );
      this.addMessageToState(message);
      return;
    }
    localStorage.setItem("openapi_key", apiKey);
    this.addOpenApiKeyToState(apiKey);
    const initUrl = APIService.CHATBOT_SERVICE + "genai/init";
    superagent
      .post(initUrl)
      .send({ openai_api_key: apiKey })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          const errormessage = this.createChatBotMessage(
            "Failed to initialize chatbot. Please reverify the OpenAI API key.",
            {
              loading: true,
              terminateLoading: true,
            },
          );
          this.addMessageToState(errormessage);
          return;
        }
        console.log(res);
        const successmessage = this.createChatBotMessage(
          "Chatbot initialized successfully.",
          {
            loading: true,
            terminateLoading: true,
          },
        );
        this.addMessageToState(successmessage);
        this.addInitializedToState();
      });
  };

  handleChat = (message: string, accessToken: string): void => {
    const chatUrl = APIService.CHATBOT_SERVICE + "genai/ask";
    superagent
      .post(chatUrl)
      .send({ question: message })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          const errormessage = this.createChatBotMessage(
            "Failed to get response from chatbot. Please reverify the OpenAI API key.",
            {
              loading: true,
              terminateLoading: true,
            },
          );
          this.addMessageToState(errormessage);
          return;
        }
        console.log(res);
        const successmessage = this.createChatBotMessage(res.body.answer, {
          loading: true,
          terminateLoading: true,
        });
        this.addMessageToState(successmessage);
      });
  };

  handleHelp = (initRequired: boolean): void => {
    console.log("Initialization required:", initRequired);
    if (initRequired) {
      const message = this.createChatBotMessage(
        "To initialize the chatbot, please type init and press enter. To clear the chat context, type clear or reset and press enter.",
        {
          loading: true,
          terminateLoading: true,
        },
      );
      this.addMessageToState(message);
    } else {
      const message = this.createChatBotMessage(
        "Chat with the bot and exploit it.",
        {
          loading: true,
          terminateLoading: true,
        },
      );
      this.addMessageToState(message);
    }
  };

  handleResetContext = (accessToken: string): void => {
    localStorage.removeItem("chat_messages");
    this.clearMessages();
    const resetUrl = APIService.CHATBOT_SERVICE + "genai/reset";
    superagent
      .post(resetUrl)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .end((err, res) => {
        if (err) {
          console.log(err);
          const errormessage = this.createChatBotMessage(
            "Failed to clear chat context.",
            {
              loading: true,
              terminateLoading: true,
            },
          );
          this.addMessageToState(errormessage);
          return;
        }
        console.log(res);
        const successmessage = this.createChatBotMessage(
          "Chat context has been cleared.",
          {
            loading: true,
            terminateLoading: true,
          },
        );
        this.addMessageToState(successmessage);
        this.addInitializedToState();
      });
  };

  addMessageToState = (message: ChatBotMessage): void => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message],
    }));
  };

  addOpenApiKeyToState = (api_key: string | null): void => {
    this.setState((state) => ({
      ...state,
      openapiKey: api_key,
    }));
  };

  addInitializingToState = (): void => {
    this.setState((state) => ({
      ...state,
      initializing: true,
    }));
  };

  addInitializedToState = (): void => {
    this.setState((state) => ({
      ...state,
      initializing: false,
      initializationRequired: false,
    }));
  };

  clearMessages = (): void => {
    this.setState((state) => ({
      ...state,
      messages: [],
    }));
  };
}

export default ActionProvider;
