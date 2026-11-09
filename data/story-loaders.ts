// File ini dibuat otomatis. Jangan diedit manual.

type StoryModule = { default: any };

const storyLoaders: Record<string, () => Promise<StoryModule>> = {
  "n5-konbini": () => import("./story-details/n5-konbini.json"),
  "n5-ichiba": () => import("./story-details/n5-ichiba.json"),
  "n4-vending-machine": () => import("./story-details/n4-vending-machine.json"),
  "n4-densha": () => import("./story-details/n4-densha.json"),
  "n4-gomi": () => import("./story-details/n4-gomi.json"),
  "n4-pekerjaan": () => import("./story-details/n4-pekerjaan.json"),
  "n4-apotek": () => import("./story-details/n4-apotek.json"),
  "n3-ke-polisi": () => import("./story-details/n3-ke-polisi.json"),
  "n4-perpustakaan": () => import("./story-details/n4-perpustakaan.json"),
  "n3-pindah-rumah": () => import("./story-details/n3-pindah-rumah.json"),
};

export async function loadStory(id: string): Promise<any> {
  const loader = storyLoaders[id];

  if (!loader) {
    throw new Error(`Cerita tidak ditemukan: ${id}`);
  }

  const module = await loader();
  return module.default;
}
