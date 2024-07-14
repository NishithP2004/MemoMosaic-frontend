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

export const Stage4 = ({ setStage, script }) => {
  async function addToPage() {
    const scenes = await Promise.all(
      script.scenes.map(async (scene: Scene, index) => {
        return {
          ...scene,
          canvaUrl: (
            await upload({
              type: scene.type,
              mimeType: scene.mimeType,
              url: `data:${scene.mimeType};base64,${scene.collage}`,
              thumbnailUrl: `data:${scene.mimeType};base64,${scene.collage}`,
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
                thumbnailUrl={`data:${scene.mimeType};base64,${scene.collage}`}
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
        Add to Page
      </Button>
      <Button onClick={() => setStage(0)} variant="secondary" stretch>
        Start Over
      </Button>
    </Rows>
  );
};
