
"use client";

import { useState } from "react";
import { getProfilePhotoLayout } from "@/lib/profile-photo-layout";

interface ProfilePictureProps {
  avatar?: string;
  photoSrc?: string | null;
  size?: number;
  className?: string;
  photoPositionX?: number;
  photoPositionY?: number;
  photoZoom?: number;
}

export default function ProfilePicture({
  photoSrc,
  size = 64,
  className = "",
  photoPositionX = 50,
  photoPositionY = 50,
  photoZoom = 1,
}: ProfilePictureProps) {
  const [imageSize, setImageSize] = useState<{
    src: string | null;
    width: number;
    height: number;
  }>({
    src: null,
    width: 0,
    height: 0,
  });

  const layout =
  photoSrc && imageSize.src === photoSrc && imageSize.width > 0
    ? getProfilePhotoLayout(
        imageSize.width,
        imageSize.height,
        size,
        { photoPositionX, photoPositionY, photoZoom }
      )
    : null;

  return (
    <div
      role="img"
      aria-label={photoSrc ? "Foto profil pengguna" : "Foto profil default Fude"}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#B8860B]/50 bg-gradient-to-br from-[#49302D] via-[#282632] to-[#151719] shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      {photoSrc ? (
        <img
          src={photoSrc}
          alt=""
          draggable={false}
          onLoad={(event) => {
            setImageSize({
              src: photoSrc,
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            });
          }}
          className="absolute max-w-none"
          style={layout ? {
            width: layout.width,
            height: layout.height,
            left: layout.left,
            top: layout.top,
          } : {
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="59" fill="#242735" />
          <circle cx="91" cy="29" r="19" fill="#B8860B" opacity="0.9" />
          <path d="M0 82 L36 42 L62 75 L83 51 L120 91 V120 H0Z" fill="#41475B" />
          <path d="M20 120 Q23 87 60 83 Q97 87 100 120Z" fill="#C93438" />
          <path d="M43 86 L60 101 L77 86 L70 120 H50Z" fill="#EAE6DD" />
          <rect x="53" y="69" width="14" height="21" rx="6" fill="#E8B99E" />
          <ellipse cx="60" cy="51" rx="23" ry="27" fill="#F0C9AE" />
          <path d="M36 53 Q30 19 61 18 Q91 19 85 58 L80 42 Q67 49 47 39 L39 62Z" fill="#282027" />
          <path d="M38 48 Q45 39 55 43 Q61 47 67 43 Q79 38 83 49 L80 32 Q65 15 48 25Z" fill="#35252A" />
          <circle cx="52" cy="55" r="2" fill="#30242A" />
          <circle cx="69" cy="55" r="2" fill="#30242A" />
          <path d="M55 67 Q60 71 66 67" fill="none" stroke="#A75B59" strokeWidth="2" strokeLinecap="round" />
          <circle cx="84" cy="34" r="5" fill="#C93438" />
          <circle cx="90" cy="28" r="5" fill="#E6A0A0" />
          <circle cx="96" cy="34" r="5" fill="#C93438" />
          <circle cx="90" cy="40" r="5" fill="#E6A0A0" />
        </svg>
      )}
    </div>
  );
}
