import {
  Button,
  Rows,
  FormField,
  FileInput,
  FileInputItem,
  SegmentedControl,
  Alert,
} from "@canva/app-ui-kit";
import { useState } from "react";
import ExifReader from "exifreader";
import { Buffer } from "buffer";

async function reverseGeocode(gps) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gps.lat}&lon=${gps.lng}&zoom=18&addressdetails=1`
    ).then((r) => r.json());
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function extractFaces(assets) {
  try {
    const images = assets
      .filter((asset) => asset.type === "IMAGE")
      .map((asset) => asset.buffer);

    const detections = await fetch(`${BACKEND_HOST}/extractFaces`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: images,
      }),
    }).then((res) => res.json());

    return detections.faces || [];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function parseDateString(DateTimeOriginal) {
  let args = DateTimeOriginal.split(" ");
  let [YYYY, MM, DD] = args[0].split(":");
  let [hh, mm, ss] = args[1].split(":");

  return new Date(YYYY, MM - 1, DD, hh, mm, ss).toISOString();
}

export const Stage0 = ({
  setStage,
  payload,
  setPayload,
  annotations,
  setAnnotations,
}) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    let assets: Asset[] = await Promise.all(
      files.map(async (file, i) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer).toString("base64");
        let tags;

        if (file.type.startsWith("image")) {
          tags = await ExifReader.load(arrayBuffer, {
            expanded: true,
          });
        }

        const gps = {
          lat: tags?.gps?.Latitude,
          lng: tags?.gps?.Longitude,
        };

        const locationData =
          gps.lat && gps.lng
            ? await reverseGeocode(gps)
            : {
                display_name: "",
                name: "",
                address: {
                  city: "",
                  country: "",
                },
              };

        return {
          buffer: buffer,
          mimeType: file.type,
          location: locationData.name ? locationData.display_name : "",
          creation_time: tags?.exif?.["DateTimeOriginal"]?.description
            ? parseDateString(tags?.exif?.["DateTimeOriginal"]?.description)
            : new Date().toISOString(),
          type: file.type.startsWith("image")
            ? "IMAGE"
            : file.type.startsWith("video")
            ? "VIDEO"
            : "AUDIO",
        };
      })
    );

    setPayload((prev) => {
      return {
        ...prev,
        assets: assets,
      };
    });

    try {
      const faces = await extractFaces(assets);

      setAnnotations(
        faces.map((face) => {
          return {
            buffer: face,
            annotation: "",
          };
        })
      );

      setLoading(false);
      setError("");

      if (faces.length > 0) setStage(5);
      else setStage(1);
    } catch (err) {
      setError("Oops! Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Rows spacing="2u">
        {error ? <Alert tone="critical">{error}</Alert> : ""}
        <FormField
          control={() => (
            <>
              <FileInput
                multiple
                stretchButton
                accept={["image/*", "video/*"]}
                id="assets"
                onDropAcceptedFiles={(files) => setFiles(files)}
              />
              {files.map((file) => {
                return (
                  <FileInputItem
                    label={file.name}
                    key={file.name}
                    onDeleteClick={() => {
                      setFiles((savedFiles) => {
                        return savedFiles.filter((f) => f.name !== file.name);
                      });
                    }}
                  />
                );
              })}
            </>
          )}
          label="Upload your Assets"
          description="The size of uploaded assets must not exceed 20MB."
        />
        <FormField
          control={() => (
            <SegmentedControl
              options={[
                {
                  value: "album",
                  label: "Album",
                },
                {
                  value: "vlog",
                  label: "Vlog",
                },
              ]}
              defaultValue={payload.type}
              id="type"
              onChange={(value: "album" | "vlog") => {
                setPayload((prev) => {
                  return {
                    ...prev,
                    type: value,
                  };
                });
              }}
            />
          )}
          label="Type"
        />
        <Button
          type="submit"
          variant="primary"
          stretch
          loading={loading}
          disabled={files.length === 0}
        >
          Next
        </Button>
        <Button
          type="reset"
          variant="secondary"
          stretch
          onClick={(ev) => {
            ev.preventDefault();
            setFiles((prev) => {
              return [];
            });
            setLoading(false);
          }}
        >
          Reset
        </Button>
      </Rows>
    </form>
  );
};
