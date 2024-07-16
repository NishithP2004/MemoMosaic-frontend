import {
  Button,
  Rows,
  FormField,
  Box,
  ImageCard,
  TextInput,
} from "@canva/app-ui-kit";

export const Stage5 = ({ setStage, annotations, setAnnotations }) => {
  return (
    <Rows spacing="2u">
      {annotations.map((asset, index) => (
        <Box
          key={index}
          padding="2u"
          display="flex"
          flexDirection="column"
          width="full"
          background="canvas"
          borderRadius="large"
        >
          <ImageCard
            ariaLabel={`Asset ${index + 1}`}
            thumbnailUrl={`data:image/png;base64,${asset.buffer}`}
            onClick={(ev) => {}}
            borderRadius="standard"
          />
          <Box paddingTop="1u">
            <FormField
              label="Annotation"
              control={() => (
                <TextInput
                  placeholder="Enter annotation"
                  defaultValue={asset.annotation || ""}
                  onChange={(value) => {
                    setAnnotations((prev) => {
                      const newAnnotations = [...prev];
                      newAnnotations[index] = {
                        ...newAnnotations[index],
                        annotation: value,
                      };
                      return newAnnotations;
                    });
                  }}
                />
              )}
            />
          </Box>
        </Box>
      ))}
      <Button onClick={() => setStage(1)} variant="primary" stretch>
        Next
      </Button>
      <Button onClick={() => setStage(0)} variant="secondary" stretch>
        Back
      </Button>
    </Rows>
  );
};
