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

import "./style.css";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Layout,
  Descriptions,
  Card,
  Button,
  Avatar,
  Typography,
} from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import { formatDateFromIso } from "../../utils";
import defaultProficPic from "../../assets/default_profile_pic.png";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;
const { Meta } = Card;
const { Paragraph } = Typography;

const Forum = (props) => {
  const navigate = useNavigate();
  const { posts, prevOffset, nextOffset } = props;

  const renderAvatar = (url) => (
    <Avatar src={url || defaultProficPic} size="large" />
  );
  console.log("Prev offset", prevOffset);
  console.log("Next offset", nextOffset);
  const handleNewPostClick = () => {
    navigate("/new-post");
  };
  const handlePostClick = (postId) => {
    navigate(`/post?post_id=${postId}`);
  };
  return (
    <Layout className="page-container">
      <PageHeader
        title="Forum"
        className="page-header"
        extra={[
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            key="add-coupons"
            onClick={handleNewPostClick}
          >
            New Post
          </Button>,
        ]}
      />
      <Content>
        <Row gutter={[40, 40]}>
          {posts.map((post) => (
            <Col key={post.id}>
              <Card hoverable onClick={() => handlePostClick(post.id)}>
                <Meta
                  avatar={renderAvatar(post.author.profile_pic_url)}
                  title={post.title}
                />
                <Descriptions size="small" col={2}>
                  <Descriptions.Item label="Posted by">
                    {post.author.nickname}
                  </Descriptions.Item>
                  <Descriptions.Item label="Posted on">
                    {formatDateFromIso(post.CreatedAt)}
                  </Descriptions.Item>
                </Descriptions>
                <Typography className="post-content">
                  {post.content.split("\n").map((para) => (
                    <Paragraph key={para}>{para}</Paragraph>
                  ))}
                </Typography>
              </Card>
            </Col>
          ))}
        </Row>
        <Row justify="center">
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={() => props.handleOffsetChange(prevOffset)}
            disabled={prevOffset === null}
          >
            Previous
          </Button>
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={() => props.handleOffsetChange(nextOffset)}
            disabled={!nextOffset}
          >
            Next
          </Button>
        </Row>
      </Content>
    </Layout>
  );
};

Forum.propTypes = {
  posts: PropTypes.array,
  prevOffset: PropTypes.number,
  nextOffset: PropTypes.number,
  handleOffsetChange: PropTypes.func,
};

const mapStateToProps = ({
  communityReducer: { posts, prevOffset, nextOffset },
}) => {
  return { posts, prevOffset, nextOffset };
};

export default connect(mapStateToProps)(Forum);
