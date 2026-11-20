"use client";

interface ProfilePictureProps {
  avatar?: string;
  photoSrc?: string | null;
  size?: number;
  className?: string;
}

export default function ProfilePicture({
  avatar = "筆",
  photoSrc,
  size = 64,
  className = "",
}: ProfilePictureProps) {
  return (
    <div
      role="img"
      aria-label="Foto profil"
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#B8860B]/35 bg-[#262523] shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      {photoSrc ? (
        <img
          src={photoSrc}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-mincho text-[#EAE6DD]"
          style={{ fontSize: Math.max(20, size * 0.48) }}
        >
          {avatar}
        </span>
      )}
    </div>
  );
}
