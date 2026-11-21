
"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ZoomIn, Move, RotateCcw, Camera } from "lucide-react";
import { getProfilePhotoLayout } from "@/lib/profile-photo-layout";

export interface ProfilePhotoSettings {
  photoPositionX: number;
  photoPositionY: number;
  photoZoom: number;
}

interface Props {
  photoSrc: string | null;
  file: File | null;
  initialSettings: ProfilePhotoSettings;
  onSettingsChange: (settings: ProfilePhotoSettings) => void;
  onChoosePhoto: () => void;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function ProfilePhotoEditor({
  photoSrc,
  file,
  initialSettings,
  onSettingsChange,
  onChoosePhoto,
}: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [settings, setSettings] = useState(initialSettings);

  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  const [previewSize, setPreviewSize] = useState(240);
  const [ready, setReady] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef<{
    id: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
    zoom: number;
    size: number;
  } | null>(null);

  const imageUrl = fileUrl ?? photoSrc;

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setFileUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    setSettings(initialSettings);
  }, [
    initialSettings.photoPositionX,
    initialSettings.photoPositionY,
    initialSettings.photoZoom,
  ]);

  useEffect(() => {
    setReady(false);
    setImageSize({ width: 0, height: 0 });
  }, [imageUrl]);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setPreviewSize(element.getBoundingClientRect().width);
    });

    observer.observe(element);
    setPreviewSize(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  function updateSettings(next: ProfilePhotoSettings) {
    setSettings(next);
    onSettingsChange(next);
  }

  const layout = imageSize.width
    ? getProfilePhotoLayout(
        imageSize.width,
        imageSize.height,
        previewSize,
        settings
      )
    : null;

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!ready) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startX: settings.photoPositionX,
      startY: settings.photoPositionY,
      zoom: settings.photoZoom,
      size: event.currentTarget.getBoundingClientRect().width,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.id !== event.pointerId) return;

    const centeredLayout = getProfilePhotoLayout(
      imageSize.width,
      imageSize.height,
      drag.size,
      {
        photoPositionX: 50,
        photoPositionY: 50,
        photoZoom: drag.zoom,
      }
    );

    if (!centeredLayout) return;

    const overflowX = centeredLayout.width - drag.size;
    const overflowY = centeredLayout.height - drag.size;

    updateSettings({
      ...settings,
      photoPositionX:
        overflowX > 0
          ? clamp(drag.startX - (
              (event.clientX - drag.x) / overflowX
            ) * 100)
          : drag.startX,
      photoPositionY:
        overflowY > 0
          ? clamp(drag.startY - (
              (event.clientY - drag.y) / overflowY
            ) * 100)
          : drag.startY,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.id === event.pointerId) {
      dragRef.current = null;
    }
  }

  function resetSettings() {
    updateSettings({
      photoPositionX: 50,
      photoPositionY: 50,
      photoZoom: 1,
    });
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#EAE6DD]">
            Foto Profil
          </h4>
          <p className="text-xs text-[#A3A099] mt-1">
            Atur posisi dan pembesaran foto.
          </p>
        </div>

        <button
          type="button"
          onClick={onChoosePhoto}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#262523] border border-[#44413D] text-xs font-bold text-[#EAE6DD] hover:border-[#B8860B]"
        >
          <Camera size={14} />
          Ganti Foto
        </button>
      </div>

      <div
        ref={previewRef}
        className="relative mx-auto w-full max-w-[240px] aspect-square overflow-hidden rounded-full border-2 border-[#B8860B]/60 bg-[#121110] cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview foto profil"
            draggable={false}
            onLoad={(event) => {
              setImageSize({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              });
              setReady(true);
            }}
            className="absolute max-w-none pointer-events-none"
            style={
              layout
                ? {
                    width: layout.width,
                    height: layout.height,
                    left: layout.left,
                    top: layout.top,
                  }
                : { visibility: "hidden" }
            }
          />
        )}

        {!imageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#817A73] gap-2">
            <Camera size={28} />
            <span className="text-xs">Belum ada foto</span>
          </div>
        )}

        {imageUrl && !ready && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white/60">
            Memuat foto...
          </div>
        )}
      </div>

      <p className="flex items-center justify-center gap-2 text-[11px] text-[#817A73] mt-3">
        <Move size={13} />
        Geser foto untuk mengatur posisi
      </p>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-[#A3A099] mb-2">
          <span className="flex items-center gap-2">
            <ZoomIn size={14} />
            Zoom
          </span>
          <span>{Math.round(settings.photoZoom * 100)}%</span>
        </div>

        <input
          type="range"
          min="1"
          max="3"
          step="0.05"
          value={settings.photoZoom}
          disabled={!ready}
          onChange={(event) =>
            updateSettings({
              ...settings,
              photoZoom: Number(event.target.value),
            })
          }
          className="w-full accent-[#C93438]"
        />
      </div>

      <button
        type="button"
        onClick={resetSettings}
        disabled={!ready}
        className="flex items-center gap-2 text-xs text-[#A3A099] hover:text-white mt-3 disabled:opacity-40"
      >
        <RotateCcw size={13} />
        Reset posisi foto
      </button>
    </div>
  );
}
