
"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { X, ZoomIn, Move } from "lucide-react";

interface ProfilePhotoCropperProps {
  file: File;
  onCancel: () => void;
  onSave: (blob: Blob) => Promise<void>;
}

const CROP_SIZE = 288;
const OUTPUT_SIZE = 512;

export default function ProfilePhotoCropper({
  file,
  onCancel,
  onSave,
}: ProfilePhotoCropperProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);

    setImageUrl(url);
    setReady(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const scale = imageSize.width
    ? Math.max(
        CROP_SIZE / imageSize.width,
        CROP_SIZE / imageSize.height
      ) * zoom
    : 1;

  const displayWidth = imageSize.width * scale;
  const displayHeight = imageSize.height * scale;

  function clampOffset(
    next: { x: number; y: number },
    zoomValue: number
  ) {
    if (!imageSize.width) return next;

    const nextScale =
      Math.max(
        CROP_SIZE / imageSize.width,
        CROP_SIZE / imageSize.height
      ) * zoomValue;

    const maxX = Math.max(
      0,
      (imageSize.width * nextScale - CROP_SIZE) / 2
    );

    const maxY = Math.max(
      0,
      (imageSize.height * nextScale - CROP_SIZE) / 2
    );

    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!ready || saving) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    setOffset(
      clampOffset(
        {
          x: drag.offsetX + event.clientX - drag.x,
          y: drag.offsetY + event.clientY - drag.y,
        },
        zoom
      )
    );
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function handleZoom(value: number) {
    setZoom(value);
    setOffset((previous) => clampOffset(previous, value));
  }

  function exportCrop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = imageRef.current;

      if (!image || !ready) {
        reject(new Error("Foto belum siap diproses."));
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Browser tidak mendukung pemrosesan foto."));
        return;
      }

      const sourceScale =
        Math.max(
          CROP_SIZE / image.naturalWidth,
          CROP_SIZE / image.naturalHeight
        ) * zoom;

      const left =
        (CROP_SIZE - image.naturalWidth * sourceScale) / 2 +
        offset.x;

      const top =
        (CROP_SIZE - image.naturalHeight * sourceScale) / 2 +
        offset.y;

      const sourceX = Math.max(0, -left / sourceScale);
      const sourceY = Math.max(0, -top / sourceScale);

      const sourceWidth = Math.min(
        CROP_SIZE / sourceScale,
        image.naturalWidth - sourceX
      );

      const sourceHeight = Math.min(
        CROP_SIZE / sourceScale,
        image.naturalHeight - sourceY
      );

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Gagal memproses hasil crop foto."));
          }
        },
        "image/jpeg",
        0.92
      );
    });
  }

  async function handleSave() {
    if (!ready || saving) return;

    setSaving(true);
    setError("");

    try {
      const blob = await exportCrop();
      await onSave(blob);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan foto."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-title"
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1B1A19] p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3
              id="crop-title"
              className="text-lg font-bold text-[#EAE6DD]"
            >
              Atur Foto Profil
            </h3>
            <p className="text-xs text-[#A3A099] mt-1">
              Sesuaikan posisi foto kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="Tutup"
            className="p-2 rounded-full bg-[#33312E] text-[#A3A099] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="relative mx-auto h-72 w-72 max-w-full overflow-hidden rounded-full border-2 border-[#B8860B]/60 bg-[#121110] cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {imageUrl && (
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Preview crop foto profil"
              draggable={false}
              onLoad={(event) => {
                const image = event.currentTarget;

                setImageSize({
                  width: image.naturalWidth,
                  height: image.naturalHeight,
                });

                setReady(true);
              }}
              onError={() => setError("Gambar tidak bisa dibuka.")}
              className="pointer-events-none absolute max-w-none"
              style={{
                width: displayWidth,
                height: displayHeight,
                top: "50%",
                left: "50%",
                transform: `translate3d(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px), 0)`,
              }}
            />
          )}

          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/60">
              Memuat foto...
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-7">
          <ZoomIn size={18} className="text-[#B8860B]" />

          <div className="flex-1">
            <div className="flex justify-between text-xs text-[#A3A099] mb-2">
              <span>Perbesar / Perkecil</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) =>
                handleZoom(Number(event.target.value))
              }
              disabled={!ready || saving}
              className="w-full accent-[#C93438]"
            />
          </div>
        </div>

        <p className="flex items-center justify-center gap-2 text-[11px] text-[#817A73] mt-4">
          <Move size={13} />
          Geser foto untuk mengatur posisinya
        </p>

        {error && (
          <p className="text-sm text-red-400 text-center mt-4">
            {error}
          </p>
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
            {saving ? "Menyimpan..." : "Simpan Foto"}
          </button>
        </div>
      </section>
    </div>
  );
}
