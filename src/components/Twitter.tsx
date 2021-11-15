import React from "react";
import styled from "styled-components";

interface IProps {}

const Twitter: React.SFC<IProps> = ({}) => {
  return (
    <TwitterAnchor
      href="https://epranka.com"
      target="_blank"
      title="Edvinas Pranka | Senior Developer"
    >
      <span>epranka.com</span>
    </TwitterAnchor>
  );
};

const TwitterAnchor = styled.a`
  position: fixed;
  top: 12px;
  left: 20px;
  color: white;
  z-index: 3;
  font-weight: bold;

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
