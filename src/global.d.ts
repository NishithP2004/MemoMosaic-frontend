type PlayHTCredentials = {
  userId: string;
  secretKey: string;
  gender: "male" | "female";
  audio: string;
};

type Asset = {
  buffer: string; // base64 representation
  creation_time: string | undefined;
  location: string;
  canvaUrl?: string;
  type?: "AUDIO" | "IMAGE" | "VIDEO";
  mimeType: string;
};

type Payload = {
  type: "vlog" | "album";
  assets: Asset[];
  memorableMoments: string;
};

type Scene = {
  scene: string | number;
  narrative: string;
  collage: string;
  type: AssetUploadOptions;
  mimeType: ImageMimeType | VideoMimeType | AudioMimeType;
  location: string;
  audio: string;
  background_image: string;
  canvaUrl?: string;
};

type Script = {
  title: string;
  caption: string;
  hastags: string[];
  scenes: Scene[];
};
