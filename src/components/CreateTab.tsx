import { useState } from "react";

import { Stage0 } from "./Stage0";
import { Stage1 } from "./Stage1";
import { Stage2 } from "./Stage2";
import { Stage3 } from "./Stage3";
import { Stage4 } from "./Stage4";

export const CreateTab = ({ playHTCred, setPlayHTCred }) => {
  const [stage, setStage] = useState(0);
  const [script, setScript] = useState<Script>();

  const [payload, setPayload] = useState<Payload>({
    type: "album",
    assets: [],
    memorableMoments: "",
  });

  if (stage === 0) {
    return (
      <Stage0 setStage={setStage} payload={payload} setPayload={setPayload} />
    );
  } else if (stage === 1) {
    return (
      <Stage1 setStage={setStage} payload={payload} setPayload={setPayload} />
    );
  } else if (stage === 2) {
    return (
      <Stage2 setStage={setStage} payload={payload} setPayload={setPayload} />
    );
  } else if (stage === 3) {
    return (
      <Stage3
        setStage={setStage}
        payload={payload}
        setPayload={setPayload}
        script={script}
        setScript={setScript}
        playHTCred={playHTCred}
      />
    );
  } else if (stage === 4) {
    return <Stage4 setStage={setStage} script={script} />;
  }

  return null;
};
