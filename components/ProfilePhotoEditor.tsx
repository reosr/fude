
"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { X, ZoomIn, Move, RotateCcw } from "lucide-react";

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
  const [positionX, setPositionX] = useState(
    initialSettings.photoPositionX
  );
  const [positionY, setPositionY] = useState(
    initialSettings.photoPositionY
  );
  const [zoom, setZoom] = useState(initialSettings.photoZoom);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dragRef = useRef<{
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  zoom: number;
} | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
  if (!ready || saving) return;

  const activeZoom = zoom <= 1 ? 1.5 : zoom;

  if (activeZoom !== zoom) {
    setZoom(activeZoom);
  }

  event.currentTarget.setPointerCapture(event.pointerId);

  dragRef.current = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    startX: positionX,
    startY: positionY,
    zoom: activeZoom,
  };
}

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
  const drag = dragRef.current;

  if (!drag || drag.id !== event.pointerId) return;

  const deltaX = event.clientX - drag.x;
  const deltaY = event.clientY - drag.y;

  const previewSize = 288;
  const zoomRange = Math.max(drag.zoom - 1, 0.05);

  setPositionX(
    clamp(
      drag.startX +
        (deltaX / previewSize) * 100 / zoomRange
    )
  );

  setPositionY(
    clamp(
      drag.startY +
        (deltaY / previewSize) * 100 / zoomRange
    )
  );
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

  const translateX = (positionX - 50) * (zoom - 1);
  const translateY = (positionY - 50) * (zoom - 1);

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-[#121110]/60 backdrop-blur-sm p-4">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1B1A19]/95 p-5 shadow-2xl">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#EAE6DD]">
              Atur Foto Profil
            </h3>
            <p className="text-xs text-[#A3A099] mt-1">
              Geser dan atur ukuran tampilan fotomu.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="p-2 rounded-full bg-[#33312E] text-white/70"
          >
            <X size={19} />
          </button>
        </div>

        <div
          className="relative mx-auto w-72 h-72 max-w-full overflow-hidden rounded-full border-2 border-[#B8860B]/60 bg-[#121110] cursor-grab active:cursor-grabbing touch-none"
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
              onLoad={() => setReady(true)}
              onError={() => setError("Gambar tidak dapat dibuka.")}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              style={{
                objectPosition: `${100 - positionX}% ${100 - positionY}%`,
                transform: `translate(${translateX}%, ${translateY}%) scale(${zoom})`,
                transformOrigin: "center",
              }}
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

        <button
          type="button"
          onClick={resetSettings}
          disabled={saving}
          className="flex items-center gap-2 text-xs text-[#A3A099] hover:text-white mt-4"
        >
          <RotateCcw size={13} />
          Reset posisi
        </button>

        {error && (
          <p className="text-sm text-red-400 mt-4">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-[#33312E] text-[#EAE6DD] text-sm font-bold"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!ready || saving}
            className="flex-1 py-3 rounded-xl bg-[#C93438] text-white text-sm font-bold disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </section>
    </div>
  );
}
