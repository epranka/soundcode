import React from "react";
import styled from "styled-components";

interface IProps {}

const Twitter: React.SFC<IProps> = ({}) => {
  return (
    <TwitterAnchor
      href="https://twitter.com/epranka"
      target="_blank"
      title="Follow on Twitter"
    >
      <img src="/twitter.png" alt="Twitter logo" /> <span>epranka</span>
    </TwitterAnchor>
  );
};

const TwitterAnchor = styled.a`
  position: fixed;
  top: 12px;
  left: 20px;
  color: white;
  z-index: 3;

  img {
    width: 24px;
    margin-right: 4px;
  }

  &:hover {
    color: white;
    text-decoration: none;
  }
`;

export default Twitter;
