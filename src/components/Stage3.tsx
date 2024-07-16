import { Rows, Box, Text, ProgressBar, Button } from "@canva/app-ui-kit";
import { useState, useEffect } from "react";

export const Stage3 = ({
  setStage,
  payload,
  setPayload,
  script,
  setScript,
  playHTCred,
  annotations
}) => {
  const BACKEND_URL = "https://5f1f-49-205-142-70.ngrok-free.app";
  async function create(payload) {
    try {
      let response = await fetch(`${BACKEND_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          playHTCred: playHTCred,
          annotations: annotations
        }),
      }).then((r) => r.json());
      console.log(response);
      setScript(response);
      setStage(4);
    } catch (err) {
      console.error(err);
      setStage(0);
      throw err;
    }
  }

  useEffect(() => {
    create(payload);
  }, []);

  return (
    <Box
      width="full"
      height="full"
      padding="2u"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Rows spacing="2u">
        <Text>Generating {payload.type}...</Text>
        <ProgressBar size="medium" tone="info" value={100} />
        <Button onClick={() => setStage(0)} variant="secondary" stretch>
          Start Over
        </Button>
      </Rows>
    </Box>
  );
};
