import React, { useEffect, useRef, useContext, useCallback } from "react";
import { useWindowSize } from "react-use";
import styled from "styled-components";
import { TweenLite } from "gsap";
import OrchestraContext from "./OrchestraContext";

interface IProps {}

class Item {
  $dom: HTMLElement;
  visible: boolean = false;
  constructor() {
    this.$dom = document.createElement("div");
    this.$dom.style.position = "absolute";
    this.hide();
    this.setText("");
  }

  public hide() {
    this.$dom.style.opacity = "0";
    this.visible = false;
  }

  public show() {
    this.$dom.style.opacity = "1";
    this.visible = true;
  }

  public fadeIn() {
    return new Promise(resolve => {
      if (this.visible) return resolve();
      TweenLite.to(this.$dom, 0.25, {
        opacity: 1,
        onComplete: () => {
          this.visible = true;
          resolve();
        }
      });
    });
  }

  public fadeOut() {
    return new Promise(resolve => {
      if (!this.visible) return resolve();
      TweenLite.to(this.$dom, 0.25, {
        opacity: 0,
        onComplete: () => {
          this.visible = false;
          resolve();
        }
      });
    });
  }

  public slowFadeOut() {
    return new Promise(resolve => {
      if (!this.visible) resolve();
      TweenLite.to(this.$dom, 7, {
        opacity: 0,
        onComplete: () => {
          this.visible = false;
          resolve();
        }
      });
    });
  }

  public setText(text: string) {
    if (text.length > 24) {
      text = text.substring(0, 24) + "...";
    }
    this.$dom.innerText = text;
  }

  public setPosition(x: number, y: number) {
    TweenLite.set(this.$dom, { x, y });
  }
}

const Visualizer: React.SFC<IProps> = ({}) => {
  const $visualizerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<number>(0);
  const items = useRef<Item[]>([]);

  const [{ conductor }] = useContext(OrchestraContext);

  const { width: viewportW, height: viewportH } = useWindowSize();

  const createItem = () => {
    const item = new Item();
    $visualizerRef.current?.appendChild(item.$dom);
    items.current.push(item);
  };

  const updateItems = async (text: string) => {
    pointer.current = (pointer.current + 1) % items.current.length;
    const item = items.current[pointer.current];
    await item.fadeOut();
    const [x, y] = [Math.random() * viewportW, Math.random() * viewportH];
    item.setPosition(x, y);
    item.setText(text);
    await item.fadeIn();
    item.slowFadeOut();
  };

  const handleNotify = useCallback((text: string) => {
    updateItems(text);
  }, []);

  useEffect(() => {
    if (conductor.current) {
      conductor.current.on("notify", handleNotify);
    }
    return () => {
      if (conductor.current) {
        conductor.current.off("notify", handleNotify);
      }
    };
  }, [conductor.current]);

  useEffect(() => {
    for (let i = 0; i < 40; i++) {
      createItem();
    }
  }, []);
  return <VisualizerStyled ref={$visualizerRef}></VisualizerStyled>;
};

const VisualizerStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  color: #dadada;
  font-size: 2vmax;
`;

export default Visualizer;
