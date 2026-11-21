
"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { X, ZoomIn, Move, RotateCcw } from "lucide-react";
import { getProfilePhotoLayout } from "@/lib/profile-photo-layout";

export interface ProfilePhotoSettings {
  photoPositionX: number;
  photoPositionY: number;
  photoZoom: number;
}

interface Props {
  file: File;
  initialSettings: ProfilePhotoSettings;
  onCancel: () => void;
  onSave: (file: File, settings: ProfilePhotoSettings) => Promise<void>;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function ProfilePhotoEditor({
  file,
  initialSettings,
  onCancel,
  onSave,
}: Props) {
  const [url, setUrl] = useState("");
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [previewSize, setPreviewSize] = useState(288);

  const [positionX, setPositionX] = useState(initialSettings.photoPositionX);
  const [positionY, setPositionY] = useState(initialSettings.photoPositionY);
  const [zoom, setZoom] = useState(initialSettings.photoZoom);

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);

    setUrl(objectUrl);
    setReady(false);
    setImageSize({ width: 0, height: 0 });
    setPositionX(initialSettings.photoPositionX);
    setPositionY(initialSettings.photoPositionY);
    setZoom(initialSettings.photoZoom);
    setError("");

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, initialSettings]);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const updateSize = () => {
      setPreviewSize(element.getBoundingClientRect().width);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const layout = imageSize.width
    ? getProfilePhotoLayout(
        imageSize.width,
        imageSize.height,
        previewSize,
        { photoPositionX: positionX, photoPositionY: positionY, photoZoom: zoom }
      )
    : null;

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!ready || saving) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startX: positionX,
      startY: positionY,
      zoom,
      size: event.currentTarget.getBoundingClientRect().width,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.id !== event.pointerId) return;

    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;

    const imageLayout = getProfilePhotoLayout(
      imageSize.width,
      imageSize.height,
      drag.size,
      {
        photoPositionX: 50,
        photoPositionY: 50,
        photoZoom: drag.zoom,
      }
    );

    if (!imageLayout) return;

    const overflowX = imageLayout.width - drag.size;
    const overflowY = imageLayout.height - drag.size;

    // Posisi hanya berubah. Zoom tidak disentuh saat drag.
    if (overflowX > 0) {
      setPositionX(
        clamp(drag.startX - (deltaX / overflowX) * 100)
      );
    }

    if (overflowY > 0) {
      setPositionY(
        clamp(drag.startY - (deltaY / overflowY) * 100)
      );
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.id === event.pointerId) {
      dragRef.current = null;
    }
  }

  function resetSettings() {
    setPositionX(50);
    setPositionY(50);
    setZoom(1);
  }

  async function handleSave() {
    if (!ready || saving) return;

    setSaving(true);
    setError("");

    try {
      await onSave(file, {
        photoPositionX: positionX,
        photoPositionY: positionY,
        photoZoom: zoom,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan foto."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-[#121110]/60 backdrop-blur-sm p-4">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1B1A19]/95 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#EAE6DD]">
              Atur Foto Profil
            </h3>
            <p className="text-xs text-[#A3A099] mt-1">
              Geser foto dan atur zoom sesuai keinginan.
            </p>
          </div>

          <button type="button" onClick={onCancel} disabled={saving}
            className="p-2 rounded-full bg-[#33312E] text-white/70">
            <X size={19} />
          </button>
        </div>

        <div
          ref={previewRef}
          className="relative mx-auto w-full max-w-[288px] aspect-square overflow-hidden rounded-full border-2 border-[#B8860B]/60 bg-[#121110] cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {url && (
            <img
              src={url}
              alt="Preview foto profil"
              draggable={false}
              onLoad={(event) => {
                setImageSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                });
                setReady(true);
              }}
              onError={() => setError("Gambar tidak dapat dibuka.")}
              className="absolute max-w-none pointer-events-none"
              style={layout ? {
                width: layout.width,
                height: layout.height,
                left: layout.left,
                top: layout.top,
              } : { visibility: "hidden" }}
            />
          )}

          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">
              Memuat foto...
            </div>
          )}
        </div>

        <p className="flex justify-center items-center gap-2 text-xs text-[#A3A099] mt-4">
          <Move size={14} />
          Geser foto untuk mengatur posisi
        </p>

        <div className="mt-7">
          <div className="flex justify-between text-xs text-[#A3A099] mb-3">
            <span className="flex items-center gap-2">
              <ZoomIn size={15} />
              Zoom
            </span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>

          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            disabled={!ready || saving}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-[#C93438]"
          />
        </div>

        <button type="button" onClick={resetSettings} disabled={saving}
          className="flex items-center gap-2 text-xs text-[#A3A099] hover:text-white mt-4">
          <RotateCcw size={13} />
          Reset posisi
        </button>

        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onCancel} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-[#33312E] text-[#EAE6DD] text-sm font-bold">
            Batal
          </button>

          <button type="button" onClick={handleSave}
            disabled={!ready || saving}
            className="flex-1 py-3 rounded-xl bg-[#C93438] text-white text-sm font-bold disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </section>
    </div>
  );
}
