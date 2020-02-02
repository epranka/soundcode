import React from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";

interface IProps {}

const About: React.SFC<IProps> = ({}) => {
  return (
    <AboutStyled>
      <Container>
        <Header>
          <h2>About the idea</h2>
        </Header>
        <p>
          As a developer, I love listening to music while coding. The orchestral
          music allows me to focus more on what I do. And one day I noticed my
          fingers dance on the keyboard by the music rhythm. Like playing the
          piano. Every word or symbol in the code was written with harmony. And
          then I thought... how it could sound... The code I write every day?
        </p>
        <p>
          <strong style={{ fontSize: "1.1rem" }}>And the idea was born.</strong>
        </p>
        <h3 className="mt-5">How it works</h3>
        <p>
          Firstly, we load the sound fonts of the instruments which are used in
          this little orchestra. When you paste or write your code (or using our
          example), we parse it using the TypeScript AST parser to individual
          nodes. Then the composition begins.
        </p>
        <h4>The mood of the code</h4>
        <p>
          By code source, we determine the mood of the code. The more cheerful
          words in the code, the happier the mood and vice versa. The mood of
          the code is used to set the musical scale. If happy, a Major will be
          likely selected, if sad - Minor.
        </p>
        <h4>Chords</h4>
        <p>
          By the code source and with some easy math we choose which chords
          progression play from the determined musical scale.
        </p>
        <h4>The Melody of the piano</h4>
        <p>
          Each piano note is the TypeScript Token. With some math, we set the
          note, pitch, duration and time when to play. The special symbols like
          ,.+-/* and etc are excluded and used in the other instrument
        </p>
        <h4>Other instruments</h4>
        <p>
          Each instrument has its own notes. Some just looping the notes of the
          chord, while others play specific notes by the source code. For
          example, the Cello always plays active chord root note, when Harp only
          plays at the special characters or Chorus at the strings.
        </p>
        <h4>Source Code</h4>
        <p>
          This project is open source, you can check the source code on the
          GitHub:{" "}
          <strong>
            <a href="https://github.com/epranka/soundcode" target="_blank">
              epranka/soundcode
            </a>
          </strong>
          .
        </p>
        <p>
          Have ideas on how to improve it? New features? Feel free to share it
          on the{" "}
          <strong>
            <a href="https://github.com/epranka/soundcode/issues">
              GitHub Issues
            </a>
          </strong>
          .
        </p>
      </Container>
    </AboutStyled>
  );
};

const AboutStyled = styled.div`
  position: relative;
  z-index: 1;
  color: #eee;

  .container {
    max-width: 600px;
  }

  p a {
    text-decoration: none;
    color: white;
    &:hover {
      color: white;
    }
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export default About;
