import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback
} from "react";
import styled from "styled-components";
import OrchestraContext from "./OrchestraContext";
import posed from "react-pose";
import AudioRecorder from "../classes/AudioRecorder";
import Visualizer from "./Visualizer";

interface IProps {
  show: boolean;
  onStopClick: () => any;
}

type PlayStateType = "playing" | "paused" | "ended";

const PlayPage: React.SFC<IProps> = ({ show, onStopClick }) => {
  const [{ conductor, estimatedTime }] = useContext(OrchestraContext);
  const timerRef = useRef<number>();
  const timeLeftRef = useRef<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [playState, setPlayState] = useState<PlayStateType>("playing");

  const startTimer = () => {
    timeLeftRef.current = estimatedTime;
    timerRef.current = setInterval(() => {
      timeLeftRef.current = Math.max(timeLeftRef.current - 1, 0);
      setTimeLeft(timeLeftRef.current);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timeLeftRef.current = estimatedTime;
    setTimeLeft(timeLeftRef.current);
  };

  const handleOrchestraEnd = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setPlayState("ended");
  }, []);

  const handleControlButton = () => {
    if (playState === "playing") {
      onStopClick();
    } else if (playState === "ended") {
      play();
    }
  };

  const invokeAudioRecordDownload = () => {
    const audioBlob = AudioRecorder.getAudioRecordBlob();
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "The-Little-Orchestra.ogg";

    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10);
    };

    a.addEventListener("click", clickHandler, false);
    a.click();
  };

  const play = () => {
    setPlayState("playing");
    setTimeLeft(estimatedTime);
    setTimeout(() => {
      startTimer();
      if (conductor.current) {
        conductor.current.play();
        conductor.current.on("end", handleOrchestraEnd);
      }
    }, 1500);
  };

  const stop = () => {
    setTimeout(() => {
      if (conductor.current) {
        conductor.current.off("end", handleOrchestraEnd);
        conductor.current.stop();
        stopTimer();
      }
    }, 1000);
  };

  useEffect(() => {
    timeLeftRef.current = estimatedTime;
    setTimeLeft(timeLeftRef.current);
  }, [estimatedTime]);

  useEffect(() => {
    if (show) {
      play();
    } else {
      stop();
    }
  }, [show]);

  return (
    <PlayPageStyled pose={show ? "show" : "hide"}>
      <Overlay />
      <Visualizer />
      <Center>
        <Timer>{timeLeft} s</Timer>
        <ControlButtonContainer>
          <div className="d-sm-flex" style={{ justifyContent: "center" }}>
            {playState === "ended" ? (
              <ControlButton onClick={onStopClick}>Exit</ControlButton>
            ) : null}
            <ControlButton onClick={handleControlButton}>
              {playState === "playing"
                ? "Stop"
                : playState === "paused"
                ? "Play"
                : "Repeat"}
            </ControlButton>
          </div>
          {playState === "ended" && AudioRecorder.isAvailable() ? (
            <ControlButton onClick={invokeAudioRecordDownload}>
              &#x2193;&nbsp;Download
            </ControlButton>
          ) : null}
        </ControlButtonContainer>
      </Center>
    </PlayPageStyled>
  );
};

const ControlButtonContainer = styled.div``;

const ControlButton = styled.div`
  display: block;
  text-align: center;
  font-size: 1.25rem;
  border: 2px solid #9e9e9e;
  border-radius: 0.125rem;
  padding: 10px 30px;
  cursor: pointer;

  margin: 0 5px;
  margin-bottom: 0.5rem;

  transition: background 0.25s ease;
  user-select: none;

  &:hover {
    background: rgba(32, 33, 36, 0.8);
  }
`;

const Timer = styled.div`
  font-size: 8vmax;
  display: block;
  user-select: none;
`;

const Center = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #eee;
  text-align: center;
  z-index: 3;
`;

const PlayPagePosed = posed.div({
  show: {
    opacity: 1,
    applyAtStart: {
      display: "block"
    }
  },
  hide: {
    opacity: 0,
    applyAtEnd: {
      display: "none"
    }
  }
});

const PlayPageStyled = styled(PlayPagePosed)`
  background: black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/play-bg.jpg");
  background-size: cover;
  background-position: center center;
  display: flex;
  align-items: center;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
`;

export default PlayPage;
