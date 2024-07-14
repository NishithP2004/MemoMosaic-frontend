import { Button, Rows, FormField, MultilineInput } from "@canva/app-ui-kit";

export const Stage2 = ({ setStage, payload, setPayload }) => {
  return (
    <Rows spacing="2u">
      <FormField
        label="Memorable Moments"
        control={() => (
          <MultilineInput
            autoGrow
            minRows={3}
            maxRows={5}
            placeholder="Remembering our first family trip to the mountains..."
            id="memorable-moments"
            maxLength={250}
            onChange={(value) => {
              setPayload((prev) => {
                return {
                  ...prev,
                  memorableMoments: value,
                };
              });
            }}
          />
        )}
        description="Please share any additional memories you would like to include in the narration."
      />
      <Button onClick={() => setStage(3)} variant="primary" stretch>
        Submit
      </Button>
      <Button onClick={() => setStage(1)} variant="secondary" stretch>
        Back
      </Button>
    </Rows>
  );
};
