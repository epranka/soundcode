import React, { useRef, useState } from "react";
import Conductor from "../classes/Conductor";
import Orchestra from "../classes/Orchestra";

type OrchestraContextType = [
  {
    orchestra: React.MutableRefObject<Orchestra | undefined>;
    conductor: React.MutableRefObject<Conductor | undefined>;
    estimatedTime: number;
  },
  (source: string) => any
];

const OrchestraContext = React.createContext<OrchestraContextType>([
  {
    orchestra: { current: undefined },
    conductor: { current: undefined },
    estimatedTime: 0
  },
  () => {}
]);

interface IProviderProps {}

export const OrchestraContextProvider: React.SFC<IProviderProps> = ({
  children
}) => {
  const [estimatedTime, setEstimatedTime] = useState(0);

  const orchestraRef = useRef<Orchestra>();
  const conductorRef = useRef<Conductor>();

  const onSourceChange = (source: string) => {
    if (conductorRef.current) {
      conductorRef.current.destroy();
    }
    const orchestra = new Orchestra(source);
    orchestraRef.current = orchestra;
    const conductor = new Conductor(orchestra);
    conductorRef.current = conductor;
    setEstimatedTime(conductor.getDurationInSeconds());
  };

  return (
    <OrchestraContext.Provider
      value={
        [
          { orchestra: orchestraRef, conductor: conductorRef, estimatedTime },
          onSourceChange
        ] as OrchestraContextType
      }
    >
      {children}
    </OrchestraContext.Provider>
  );
};

export default OrchestraContext;
