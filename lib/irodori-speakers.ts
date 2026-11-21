import type { IrodoriSpeaker } from "@/components/IrodoriConversation";

export const IRODORI_SPEAKERS = {
  yui: {
    id: "yui",
    name: "Yui",
    role: "Rekan kerja",
    voiceProfileId: "f-young-01",
    voiceDescription: "Perempuan muda · jernih, ramah, natural",
  },
  sota: {
    id: "sota",
    name: "Sota",
    role: "Rekan kerja",
    voiceProfileId: "m-young-01",
    voiceDescription: "Laki-laki muda · jelas, hangat, santai",
  },
  akiko: {
    id: "akiko",
    name: "Akiko",
    role: "Tetangga senior",
    voiceProfileId: "f-mature-01",
    voiceDescription: "Perempuan dewasa · lembut, tenang, artikulasi jelas",
  },
  kenji: {
    id: "kenji",
    name: "Kenji",
    role: "Pengelola toko",
    voiceProfileId: "m-mature-01",
    voiceDescription: "Laki-laki dewasa · suara rendah, hangat, tenang",
  },
} satisfies Record<string, IrodoriSpeaker>;
