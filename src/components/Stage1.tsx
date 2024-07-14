import {
  Button,
  Rows,
  FormField,
  Box,
  ImageCard,
  VideoCard,
  TextInput,
  Select,
} from "@canva/app-ui-kit";
import { useState } from "react";

const videoMimeTypes = [
  "video/avi",
  "video/x-m4v",
  "video/x-matroska",
  "video/quicktime",
  "video/mp4",
  "video/mpeg",
  "video/webm",
];

const getVideoMimeType = (mimeType) => {
  if (videoMimeTypes.includes(mimeType)) {
    return mimeType;
  }
  return "video/mp4";
};

async function searchCompletions(q) {
  let results = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${q}&addressdetails=1&format=json`
  ).then((res) => res.json());
  return results.map((place) => `${place.name}, ${place.address.city}`);
}

export const Stage1 = ({ setStage, payload, setPayload }) => {
  const [options, setOptions] = useState([{
    label: "",
    value: ""
  }]);
  return (
    <Rows spacing="2u">
      {payload.assets.map((asset, index) => (
        <Box
          key={index}
          padding="2u"
          display="flex"
          flexDirection="column"
          width="full"
          background="canvas"
          borderRadius="large"
        >
          {asset.type === "IMAGE" ? (
            <ImageCard
              ariaLabel={`Asset ${index + 1}`}
              thumbnailUrl={`data:${asset.mimeType};base64,${asset.buffer}`}
              onClick={(ev) => {}}
              borderRadius="standard"
            />
          ) : (
            <VideoCard
              ariaLabel={`Asset ${index + 1}`}
              thumbnailUrl={`data:${asset.mimeType};base64,${asset.buffer}`}
              mimeType={getVideoMimeType(asset.mimeType)}
              onClick={(ev) => {}}
              borderRadius="standard"
              videoPreviewUrl={`data:${asset.mimeType};base64,${asset.buffer}`}
            />
          )}
          <Box paddingTop="1u">
            <FormField
              label="Location"
              control={() => {
                {
                  /* <TextInput
                  id={`asset-location-${index}`}
                  defaultValue={asset.location}
                  placeholder="Mountain View, California"
                  maxLength={50}
                  onChange={(value) => {
                    let temp = payload.assets;
                    temp[index].location = value;
                    setPayload((prev) => {
                      return {
                        ...prev,
                        assets: temp,
                      };
                    });
                  }}
                /> */
                }
                return (
                  <Select
                  options={
                    !options.some(option => option.value === asset.location) ? 
                      [
                        {
                          label: asset.location,
                          value: asset.location
                        },
                        ...options
                      ] : options
                  }
                    value={asset.location}
                    searchable={{
                      inputPlaceholder: "Mountain View, California",
                      onInputChange: async (q) => {
                        let completions = await searchCompletions(q);
                        setOptions((prev) => completions.map(place => {
                          return {
                            label: place,
                            value: place
                          }
                        }))
                      }
                    }}
                    stretch
                    onChange={(value) => {
                      let temp = payload.assets;
                      temp[index].location = value;
                      setPayload((prev) => {
                        return {
                          ...prev,
                          assets: temp,
                        };
                      });
                      console.log(payload)
                    }}
                  />
                );
              }}
            />
          </Box>
        </Box>
      ))}
      <Button
        onClick={() => setStage(2)}
        variant="primary"
        stretch
        disabled={payload.assets.some((asset) => asset.location.length === 0)}
      >
        Next
      </Button>
      <Button onClick={() => setStage(0)} variant="secondary" stretch>
        Back
      </Button>
    </Rows>
  );
};
