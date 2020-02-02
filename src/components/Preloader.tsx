import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import drums from "../instruments/drums";
import piano from "../instruments/piano";
import cello from "../instruments/cello";
import harp from "../instruments/harp";
import flute from "../instruments/flute";
import tubaSTC from "../instruments/tuba-stc";
import bass from "../instruments/bass";
import chorusFemale from "../instruments/chorusFemale";
import posed from "react-pose";

interface IProps {
  onLoad: () => any;
  show: boolean;
}

const instruments = [
  drums,
  piano,
  cello,
  harp,
  flute,
  tubaSTC,
  bass,
  chorusFemale
];

const images = ["/preloader-bg.jpg", "/code-bg.jpg", "/play-bg.jpg"];

const preloadImage = (src: string) => {
  return new Promise(resolve => {
    const $image = document.createElement("img");
    $image.src = src;
    if ($image.complete) {
      resolve();
    } else {
      $image.onload = $image.onerror = resolve;
    }
  });
};

const Preloader: React.SFC<IProps> = ({ show, onLoad }) => {
  const [currentInstrument, setCurrentInstrument] = useState<string>("");

  const loadInstruments = async () => {
    for (const image of images) {
      await preloadImage(image);
    }
    for (const instrument of instruments) {
      setCurrentInstrument(instrument.label);
      await instrument.load();
    }
    setCurrentInstrument("");
    onLoad();
  };

  useEffect(() => {
    loadInstruments();
  }, []);

  return (
    <PreloaderStyled pose={show ? "show" : "hide"}>
      <Overlay />
      <Container>
        <Row>
          <Col>
            <TrebleClef className="text-center mb-3 h1">&#119070;</TrebleClef>
            <LoadingLabel className="text-center mb-3 h3">
              Loading {currentInstrument} sound fonts...
            </LoadingLabel>
            <LoadingSpinner className="text-center">
              <Spinner animation="grow" variant="light"></Spinner>
            </LoadingSpinner>
          </Col>
        </Row>
      </Container>
    </PreloaderStyled>
  );
};

const LoadingLabel = styled.h3`
  color: #eee;
`;

const TrebleClef = styled.div`
  color: #eee;
`;

const LoadingSpinner = styled.div``;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
`;

const PreloaderPosed = posed.div({
  show: {
    opacity: 1.0
  },
  hide: {
    opacity: 0.0,
    applyAtEnd: {
      display: "none"
    }
  }
});

const PreloaderStyled = styled(PreloaderPosed)`
  background: black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/preloader-bg.jpg");
  background-size: cover;
  background-position: center center;
  display: flex;
  align-items: center;
`;

export default Preloader;
