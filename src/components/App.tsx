import React, { useState } from "react";
import CodePage from "./CodePage";
import { OrchestraContextProvider } from "./OrchestraContext";
import PlayPage from "./PlayPage";
import Preloader from "./Preloader";
import Credits from "./Credits";

const App: React.FC = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [showPlayPage, setShowPlayPage] = useState(false);

  return (
    <OrchestraContextProvider>
      <CodePage onCreateOrchestra={() => setShowPlayPage(true)} />
      <Preloader show={showPreloader} onLoad={() => setShowPreloader(false)} />
      <PlayPage
        show={showPlayPage}
        onStopClick={() => setShowPlayPage(false)}
      />
      <Credits />
    </OrchestraContextProvider>
  );
};

export default App;
