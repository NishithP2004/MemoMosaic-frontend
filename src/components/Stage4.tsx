import {
  Rows,
  Box,
  Text,
  Button,
  ImageCard,
  VideoCard,
} from "@canva/app-ui-kit";
import { addAudioTrack, addNativeElement, addPage } from "@canva/design";
import {
  AudioMimeType,
  ImageMimeType,
  upload,
  VideoMimeType,
} from "@canva/asset";
import { useState, useEffect } from "react";
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import { Buffer } from "buffer";

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

// Temporary file store
async function uploadFile(base64Data, filename = "audio.mp3") {
  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer]);

  const formData = new FormData();
  formData.append("file", blob, filename);

  try {
    const response = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    let t = data.data.url;
    // const url = t.slice(0, t.indexOf("/", t.indexOf(".org"))) + "/dl/" + t.slice(t.indexOf("/", t.indexOf(".org")) + 1)
    const url = `${new URL(t).protocol}//${new URL(t).hostname}/dl${
      new URL(t).pathname
    }`;
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export const Stage4 = ({ setStage, script }) => {
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    const generateThumbnails = async () => {
      const newThumbnails = {};

      for (const scene of script.scenes) {
        if (scene.type === "VIDEO") {
          const buffer = Buffer.from(scene.collage, "base64");
          const blob = new Blob([buffer], { type: scene.mimeType });
          const file = new File([blob], "video.mp4", { type: scene.mimeType });
          const thumbnail = await generateVideoThumbnails(file, 1, "image/png");
          newThumbnails[scene.collage] = thumbnail[0];
        }
      }
      setThumbnails(newThumbnails);
    };

    generateThumbnails();
  }, []);

  async function addToPage() {
    const scenes = await Promise.all(
      script.scenes.map(async (scene: Scene, index) => {
        return {
          ...scene,
          canvaUrl:
            scene.type === "IMAGE"
              ? (
                  await upload({
                    type: "IMAGE",
                    mimeType: scene.mimeType,
                    url: `data:${scene.mimeType};base64,${scene.collage}`,
                    thumbnailUrl: `data:${scene.mimeType};base64,${scene.collage}`,
                  })
                ).ref
              : (
                  await upload({
                    type: "VIDEO",
                    mimeType: scene.mimeType,
                    thumbnailImageUrl: "https://i.imgur.com/yzNoPFi.jpeg",
                    url:
                      (await uploadFile(
                        scene.collage,
                        `video.${scene.mimeType.slice(
                          scene.mimeType.indexOf("/") + 1
                        )}`
                      )) || "",
                  })
                ).ref,
          backgroundRef: (
            await upload({
              type: "IMAGE",
              mimeType: "image/jpeg",
              url: scene.background_image,
              thumbnailUrl: scene.background_image,
            })
          ).ref,
          audioRef: (
            await upload({
              type: "AUDIO",
              mimeType: "audio/mp3",
              url: scene.audio,
              title: "Narration " + index,
              durationMs: 60 * 60 * 1000,
            })
          ).ref,
        };
      })
    );

    await addNativeElement({
      type: "GROUP",
      children: [
        {
          type: "TEXT",
          children: [script.title],
          top: 100,
          left: 0,
          textAlign: "center",
          fontSize: 50,
        },
        {
          type: "TEXT",
          children: [script.caption],
          top: 200,
          left: 0,
          textAlign: "center",
          fontSize: 30,
        },
        {
          type: "TEXT",
          children: [script.hashtags.join(" ")],
          top: 300,
          left: 0,
          textAlign: "center",
          fontSize: 20,
        },
      ],
    });

    scenes.forEach(async (scene, index) => {
      const narrative: string = scene.narrative;
      await addPage({
        title: `Scene ${index}`,
        background: {
          asset: {
            type: "IMAGE",
            ref: scene.backgroundRef,
          },
        },
        elements: [
          {
            type: "TEXT",
            children: [narrative],
            color: "#ffffff",
            fontSize: 30,
            top: 140,
            left: 1000,
            width: 800,
            textAlign: "justify",
          },
        ],
      });

      await addNativeElement({
        type: scene.type,
        ref: scene.canvaUrl,
        top: 140,
        left: 120,
        width: 800,
        height: 800,
      });

      await addAudioTrack({
        ref: scene.audioRef,
      });
    });
  }

  return (
    <Rows spacing="2u">
      {script.scenes.map((scene: Scene) => {
        return (
          <Box
            key={"Scene " + scene.scene}
            padding="2u"
            display="flex"
            flexDirection="column"
            width="full"
            background="canvas"
            borderRadius="large"
          >
            {scene.type === "IMAGE" ? (
              <ImageCard
                ariaLabel={`Collage ${scene.scene}`}
                thumbnailUrl={`data:${scene.mimeType};base64,${scene.collage}`}
                onClick={(ev) => {}}
                borderRadius="standard"
              />
            ) : (
              <VideoCard
                ariaLabel={`Collage ${scene.scene}`}
                thumbnailUrl={
                  thumbnails[scene.collage] ||
                  "https://i.imgur.com/yzNoPFi.jpeg"
                }
                mimeType={getVideoMimeType(scene.mimeType)}
                onClick={(ev) => {}}
                borderRadius="standard"
                videoPreviewUrl={`data:${scene.mimeType};base64,${scene.collage}`}
              />
            )}
            <Box paddingTop="1u">
              <Text>{scene.narrative}</Text>
            </Box>
          </Box>
        );
      })}
      <Button
        onClick={() => {
          addToPage();
        }}
        variant="primary"
        stretch
      >
        Add Pages
      </Button>
      <Button onClick={() => setStage(0)} variant="secondary" stretch>
        Start Over
      </Button>
      <Button onClick={() => setStage(3)} variant="tertiary" stretch>
        Regenerate
      </Button>
    </Rows>
  );
};
