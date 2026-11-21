import { createClient } from "./client";

const BUCKET = "profile-photos";

function getPhotoPath(userId: string): string {
  return `${userId}/profile-photo`;
}

async function getAuthenticatedUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Gagal memeriksa akun: ${error.message}`);
  }

  if (!user) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  return { supabase, user };
}

export async function uploadProfilePhotoToCloud(
  file: Blob,
  expectedUserId: string
): Promise<void> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran foto maksimal 5 MB.");
  }

  const { supabase, user } = await getAuthenticatedUser();

  if (user.id !== expectedUserId) {
    throw new Error("Akun berubah. Upload dibatalkan.");
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(getPhotoPath(user.id), file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Gagal mengunggah foto: ${error.message}`);
  }
}

export async function downloadProfilePhotoFromCloud(
  expectedUserId: string
): Promise<Blob | null> {
  const { supabase, user } = await getAuthenticatedUser();

  if (user.id !== expectedUserId) {
    throw new Error("Akun berubah. Download dibatalkan.");
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(getPhotoPath(user.id));

  if (error) {
    const message = error.message.toLowerCase();

    if (
      error.statusCode === "404" ||
      message.includes("not found") ||
      message.includes("does not exist")
    ) {
      return null;
    }

    throw new Error(`Gagal mengunduh foto: ${error.message}`);
  }

  return data;
}

export async function deleteProfilePhotoFromCloud(
  expectedUserId: string
): Promise<void> {
  const { supabase, user } = await getAuthenticatedUser();

  if (user.id !== expectedUserId) {
    throw new Error("Akun berubah. Penghapusan dibatalkan.");
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([getPhotoPath(user.id)]);

  if (error) {
    throw new Error(`Gagal menghapus foto: ${error.message}`);
  }
}