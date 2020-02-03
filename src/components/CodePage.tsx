import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import defaultSource from "../defaultSource";
import { useWindowSize } from "react-use";
import { Container, Row, Col } from "react-bootstrap";
import CodeEditor from "./CodeEditor";
import OrchestraContext from "./OrchestraContext";
import About from "./About";

interface IProps {
  onCreateOrchestra: () => any;
}

const CodePage: React.SFC<IProps> = ({ onCreateOrchestra }) => {
  const [source, setSource] = useState<string>(defaultSource);
  const [{ estimatedTime }, updateFromSource] = useContext(OrchestraContext);

  const { width, height } = useWindowSize();
  let editorWidth = Math.min(width, 800) - 40;
  let editorHeight = Math.max(height * 0.5, 300);

  useEffect(() => {
    updateFromSource(source);
  }, [source]);

  return (
    <CodeEditorStyled>
      <Overlay />
      <ScrollableContainer>
        <ScrollableContent>
          <Container>
            <Row>
              <Col>
                <Header>
                  <h1>Enter your Orchestra code</h1>
                  <Hint>
                    This project is created for the <strong>javascript</strong>{" "}
                    code (TS is supported), but you can try anything
                  </Hint>
                </Header>
              </Col>
            </Row>
          </Container>
          <EditorContainer style={{ width: editorWidth }}>
            <CodeEditor
              width={editorWidth - 40}
              height={editorHeight}
              value={source}
              onChange={setSource}
            />
            <ClearButton onClick={() => setSource("")}>Clear</ClearButton>
          </EditorContainer>
          <Container>
            <Row>
              <Col>
                <PlayControlContainer>
                  <EstimatedTime>
                    <TrebleClef>&#119070;</TrebleClef>
                    Estimated time: {estimatedTime} s
                  </EstimatedTime>
                  <div>
                    <PlayButton onClick={onCreateOrchestra}>
                      Create the Little orchestra
                    </PlayButton>
                  </div>
                </PlayControlContainer>
              </Col>
            </Row>
          </Container>
          <About />
        </ScrollableContent>
      </ScrollableContainer>
    </CodeEditorStyled>
  );
};

const Header = styled.div`
  color: #eee;
  z-index: 2;
  position: relative;
  max-width: 320px;
  margin: 3rem auto;
  margin-bottom: 2rem;

  h1 {
    display: block;
    text-align: center;
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 576px) {
    margin: 6rem auto;
    margin-bottom: 5rem;
    h1 {
      font-size: 3rem;
    }
  }
`;

const Hint = styled.p`
  text-align: center;
`;

const EditorContainer = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 20px;
  background: #202124;
  border: 2px solid #9e9e9e;
  border-radius: 0.125rem;
`;

const ClearButton = styled.div`
  z-index: 1;
  position: absolute;
  right: -2px;
  bottom: -33px;
  color: white;
  border: 2px solid #9e9e9e;
  border-radius: 0.125rem;
  padding: 5px 17px;
  text-align: center;
  font-size: 0.8rem;
  cursor: pointer;

  transition: background 0.25s ease;
  user-select: none;

  &:hover {
    background: rgba(32, 33, 36, 0.8);
  }
`;

const PlayControlContainer = styled.div`
  text-align: center;
  color: #eee;
  margin: 4rem auto;
  margin-bottom: 6rem;
`;

const EstimatedTime = styled.div`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const TrebleClef = styled.span`
  margin-right: 10px;
`;

const PlayButton = styled.div`
  display: inline-block;
  text-align: center;
  font-size: 1.25rem;
  border: 2px solid #9e9e9e;
  border-radius: 0.125rem;
  padding: 10px 30px;
  cursor: pointer;

  transition: background 0.25s ease;
  user-select: none;

  &:hover {
    background: rgba(32, 33, 36, 0.8);
  }
`;

const CodeEditorStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/code-bg.jpg");
  background-size: cover;
  background-position: center center;
`;

const ScrollableContainer = styled.div`
  overflow-y: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const ScrollableContent = styled.div`
  padding: 0 20px;
  padding-bottom: 150px;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
`;

export default CodePage;
