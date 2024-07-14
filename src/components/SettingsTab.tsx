import {
  Button,
  Rows,
  Text,
  FormField,
  TextInput,
  Title,
  FileInput,
  FileInputItem,
  SegmentedControl,
} from "@canva/app-ui-kit";
import { useState } from "react";

export const SettingsTab = ({ playHTCred, setPlayHTCred }) => {
  const [file, setFile] = useState<File>();
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setDisabled(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Rows spacing="2u">
        <Title size="medium">PlayHT Credentials</Title>
        <FormField
          label="User ID"
          control={() => (
            <TextInput
              id="userId"
              value={playHTCred.userId}
              disabled={disabled}
              onChange={(value) => {
                setPlayHTCred((prevValue) => ({
                  ...prevValue,
                  userId: value,
                }));
              }}
            />
          )}
        />
        <FormField
          label="Secret Key"
          control={() => (
            <TextInput
              id="secretKey"
              value={playHTCred.secretKey}
              disabled={disabled}
              onChange={(value) => {
                setPlayHTCred((prevValue) => ({
                  ...prevValue,
                  secretKey: value,
                }));
              }}
            />
          )}
        />
        <FormField
          control={() => (
            <SegmentedControl
              options={[
                {
                  value: "male",
                  label: "Male",
                },
                {
                  value: "female",
                  label: "Female",
                },
              ]}
              defaultValue={playHTCred.gender}
              id="gender"
              onChange={(value: "male" | "female") => {
                setPlayHTCred((prevValue) => {
                  return {
                    ...prevValue,
                    gender: value,
                  };
                });
              }}
            />
          )}
          label="Gender"
        />
        <FormField
          label="Upload Audio Sample"
          control={() => (
            <>
              <FileInput
                accept={["audio/wav"]}
                id="audioSample"
                stretchButton
                onDropAcceptedFiles={async (files) => {
                  const file = files[0];
                  setFile(file);
                  const arrayBuffer = await file.arrayBuffer();
                  const base64Audio =
                    Buffer.from(arrayBuffer).toString("base64");
                  setPlayHTCred((prevValue) => ({
                    ...prevValue,
                    audio: base64Audio,
                  }));
                }}
                disabled={disabled}
              />
              {file && (
                <FileInputItem
                  label={file.name}
                  key={file.name}
                  onDeleteClick={() => setFile(undefined)}
                  disabled={disabled}
                />
              )}
            </>
          )}
          description="Upload an audio sample (~30 sec) to clone your voice for narration."
        />
        <Button variant="primary" stretch type="submit" disabled={disabled}>
          Save
        </Button>
        <Button variant="secondary" stretch onClick={() => setDisabled(false)}>
          Edit
        </Button>
      </Rows>
    </form>
  );
};
