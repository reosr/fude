"use client";

import { useEffect, useRef } from "react";

const SIZE = 320;

function radial(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  stops: Array<[number, string]>,
) {
  const gradient = ctx.createRadialGradient(x, y, 1, x, y, radius);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  return gradient;
}

function drawKodama(ctx: CanvasRenderingContext2D) {
  const s = SIZE / 160;
  ctx.save();
  ctx.scale(s, s);
  ctx.clearRect(0, 0, 160, 160);

  // Soft ambient shadow beneath the complete medallion.
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.62)";
  ctx.shadowBlur = 13;
  ctx.shadowOffsetY = 7;
  ctx.beginPath();
  ctx.moveTo(80, 5);
  ctx.bezierCurveTo(99, 8, 111, 12, 123, 25);
  ctx.bezierCurveTo(143, 35, 140, 56, 145, 82);
  ctx.bezierCurveTo(143, 108, 130, 125, 111, 132);
  ctx.lineTo(80, 153);
  ctx.lineTo(49, 132);
  ctx.bezierCurveTo(30, 125, 17, 108, 15, 82);
  ctx.bezierCurveTo(20, 56, 17, 35, 37, 25);
  ctx.bezierCurveTo(49, 12, 61, 8, 80, 5);
  ctx.closePath();
  ctx.fillStyle = "#13251b";
  ctx.fill();
  ctx.restore();

  // Layered bronze and forest-glass badge rim.
  const rim = ctx.createLinearGradient(22, 15, 138, 143);
  rim.addColorStop(0, "#fff0c1");
  rim.addColorStop(.13, "#b88a4e");
  rim.addColorStop(.34, "#493623");
  rim.addColorStop(.56, "#e4c78a");
  rim.addColorStop(.78, "#63452a");
  rim.addColorStop(1, "#f7e2ad");
  ctx.fillStyle = rim;
  ctx.strokeStyle = "#302419";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(80, 5);
  ctx.bezierCurveTo(99, 8, 111, 12, 123, 25);
  ctx.bezierCurveTo(143, 35, 140, 56, 145, 82);
  ctx.bezierCurveTo(143, 108, 130, 125, 111, 132);
  ctx.lineTo(80, 153);
  ctx.lineTo(49, 132);
  ctx.bezierCurveTo(30, 125, 17, 108, 15, 82);
  ctx.bezierCurveTo(20, 56, 17, 35, 37, 25);
  ctx.bezierCurveTo(49, 12, 61, 8, 80, 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const enamel = radial(ctx, 65, 45, 112, [
    [0, "#47644a"], [.42, "#1d3b30"], [.78, "#10251d"], [1, "#07130f"],
  ]);
  ctx.fillStyle = enamel;
  ctx.beginPath();
  ctx.moveTo(80, 12);
  ctx.bezierCurveTo(99, 15, 111, 19, 118, 30);
  ctx.bezierCurveTo(135, 39, 132, 59, 137, 82);
  ctx.bezierCurveTo(135, 104, 123, 119, 106, 126);
  ctx.lineTo(80, 144);
  ctx.lineTo(54, 126);
  ctx.bezierCurveTo(37, 119, 25, 104, 23, 82);
  ctx.bezierCurveTo(28, 59, 25, 39, 42, 30);
  ctx.bezierCurveTo(49, 19, 61, 15, 80, 12);
  ctx.closePath();
  ctx.fill();

  // Atmospheric forest light, softly blurred behind the spirit.
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(7px)";
  ctx.fillStyle = "rgba(188,218,130,.25)";
  ctx.beginPath();
  ctx.ellipse(79, 75, 48, 52, -.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Sprout stems and leaves, shaded like waxy living foliage.
  function leaf(path: (ctx: CanvasRenderingContext2D) => void, x: number, y: number, r: number) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.45)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    path(ctx);
    const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    g.addColorStop(0, "#f4f1bd");
    g.addColorStop(.22, "#c9df83");
    g.addColorStop(.56, "#7da84f");
    g.addColorStop(.84, "#426b3d");
    g.addColorStop(1, "#203e2d");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(35,65,39,.9)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = "rgba(255,250,205,.72)";
    ctx.lineWidth = .8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - r * .55, y + r * .45);
    ctx.quadraticCurveTo(x, y, x + r * .52, y - r * .55);
    ctx.stroke();
    ctx.restore();
  }

  ctx.lineCap = "round";
  ctx.strokeStyle = "#614a30";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(77, 48);
  ctx.quadraticCurveTo(69, 29, 58, 19);
  ctx.moveTo(91, 45);
  ctx.quadraticCurveTo(99, 28, 110, 23);
  ctx.stroke();
  leaf((c) => {
    c.moveTo(59, 22);
    c.bezierCurveTo(39, 17, 41, 5, 49, 5);
    c.bezierCurveTo(62, 5, 69, 14, 65, 24);
    c.bezierCurveTo(63, 26, 60, 25, 59, 22);
  }, 55, 15, 12);
  leaf((c) => {
    c.moveTo(108, 27);
    c.bezierCurveTo(117, 12, 131, 17, 128, 26);
    c.bezierCurveTo(124, 38, 111, 38, 106, 31);
  }, 117, 26, 12);

  // Tiny asymmetrical body turned in three-quarter view.
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.48)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;
  ctx.beginPath();
  ctx.moveTo(68, 91);
  ctx.bezierCurveTo(56, 99, 59, 119, 69, 129);
  ctx.bezierCurveTo(81, 140, 104, 135, 110, 119);
  ctx.bezierCurveTo(115, 106, 102, 94, 91, 92);
  ctx.closePath();
  const body = ctx.createRadialGradient(74, 99, 3, 91, 115, 34);
  body.addColorStop(0, "#fffde9");
  body.addColorStop(.25, "#e0e5cc");
  body.addColorStop(.58, "#a6b99a");
  body.addColorStop(.84, "#647e69");
  body.addColorStop(1, "#344e3e");
  ctx.fillStyle = body;
  ctx.fill();
  ctx.restore();

  // Root-like feet.
  ctx.lineCap = "round";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#52684e";
  ctx.beginPath();
  ctx.moveTo(75, 126);
  ctx.quadraticCurveTo(70, 137, 62, 138);
  ctx.moveTo(96, 127);
  ctx.quadraticCurveTo(103, 138, 111, 136);
  ctx.stroke();
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = "rgba(235,239,204,.75)";
  ctx.beginPath();
  ctx.moveTo(72, 132);
  ctx.quadraticCurveTo(67, 137, 63, 137);
  ctx.moveTo(100, 132);
  ctx.quadraticCurveTo(105, 137, 109, 136);
  ctx.stroke();

  // Arms: one reaching out toward a floating forest seed.
  ctx.lineCap = "round";
  ctx.lineWidth = 9;
  ctx.strokeStyle = "#7f9879";
  ctx.beginPath();
  ctx.moveTo(99, 103);
  ctx.quadraticCurveTo(116, 103, 115, 119);
  ctx.stroke();
  ctx.strokeStyle = "#dce6c9";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(101, 103);
  ctx.quadraticCurveTo(111, 107, 113, 114);
  ctx.stroke();

  const arm = ctx.createLinearGradient(44, 88, 65, 108);
  arm.addColorStop(0, "#fffde9");
  arm.addColorStop(.42, "#dce3ca");
  arm.addColorStop(1, "#718a70");
  ctx.lineWidth = 9;
  ctx.strokeStyle = arm;
  ctx.beginPath();
  ctx.moveTo(68, 103);
  ctx.quadraticCurveTo(54, 111, 48, 101);
  ctx.quadraticCurveTo(44, 94, 48, 89);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,238,.8)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(64, 104);
  ctx.quadraticCurveTo(54, 108, 49, 100);
  ctx.stroke();

  // Oversized softly sculpted head. Multiple overlapping light fields
  // create a painted, rounded surface rather than a flat vector fill.
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.58)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.moveTo(52, 62);
  ctx.bezierCurveTo(50, 43, 64, 33, 80, 33);
  ctx.bezierCurveTo(100, 31, 113, 45, 112, 63);
  ctx.bezierCurveTo(113, 83, 101, 97, 85, 99);
  ctx.bezierCurveTo(67, 101, 53, 86, 52, 69);
  ctx.closePath();
  const skin = ctx.createRadialGradient(70, 48, 3, 87, 70, 57);
  skin.addColorStop(0, "#fffef0");
  skin.addColorStop(.16, "#f3f0dc");
  skin.addColorStop(.37, "#d9dfc7");
  skin.addColorStop(.59, "#b1c2a5");
  skin.addColorStop(.79, "#829b80");
  skin.addColorStop(1, "#425e4b");
  ctx.fillStyle = skin;
  ctx.fill();
  ctx.restore();

  // Soft subsurface warmth and cool reflected light.
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.filter = "blur(5px)";
  ctx.fillStyle = "#fff8d8";
  ctx.beginPath();
  ctx.ellipse(69, 52, 17, 20, -.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#638c76";
  ctx.beginPath();
  ctx.ellipse(103, 76, 12, 22, .3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Moss cap with irregular lobes and deep, damp shadows.
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.48)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.moveTo(53, 59);
  ctx.bezierCurveTo(47, 50, 52, 42, 60, 42);
  ctx.bezierCurveTo(62, 33, 73, 34, 77, 37);
  ctx.bezierCurveTo(84, 27, 96, 33, 98, 39);
  ctx.bezierCurveTo(108, 37, 114, 47, 109, 59);
  ctx.bezierCurveTo(101, 55, 97, 55, 92, 58);
  ctx.bezierCurveTo(85, 51, 77, 52, 71, 59);
  ctx.bezierCurveTo(64, 54, 59, 57, 53, 59);
  ctx.closePath();
  const moss = ctx.createRadialGradient(76, 39, 2, 83, 51, 32);
  moss.addColorStop(0, "#f0f3b0");
  moss.addColorStop(.22, "#c5dc7d");
  moss.addColorStop(.48, "#8eae56");
  moss.addColorStop(.74, "#557c3f");
  moss.addColorStop(1, "#29462e");
  ctx.fillStyle = moss;
  ctx.fill();
  ctx.restore();

  // Moss texture: softly shaded tiny cushions, not hard dots.
  const mossTufts = [
    [60, 48, 4], [69, 42, 3.5], [79, 39, 4], [89, 40, 3.5],
    [100, 47, 4], [72, 53, 3], [91, 52, 3.2], [106, 53, 2.6],
  ] as const;
  mossTufts.forEach(([x, y, r], i) => {
    const tuft = ctx.createRadialGradient(x - r * .35, y - r * .45, .2, x, y, r);
    tuft.addColorStop(0, i % 2 ? "#e8f0a8" : "#f5f0b6");
    tuft.addColorStop(.45, "#a9c86a");
    tuft.addColorStop(1, "rgba(48,76,40,.8)");
    ctx.fillStyle = tuft;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Deep glossy eyes with layered reflections and a subtle lower rim.
  function eye(x: number, y: number, rx: number, ry: number, rotation: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.shadowColor = "rgba(22,37,27,.45)";
    ctx.shadowBlur = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = ctx.createLinearGradient(-rx, -ry, rx, ry);
    const g = ctx.createLinearGradient(-rx, -ry, rx, ry);
    g.addColorStop(0, "#60776a");
    g.addColorStop(.24, "#263d32");
    g.addColorStop(.68, "#07130e");
    g.addColorStop(1, "#020704");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,.98)";
    ctx.beginPath();
    ctx.ellipse(-rx * .3, -ry * .43, rx * .28, ry * .23, -.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(194,220,194,.72)";
    ctx.beginPath();
    ctx.arc(rx * .34, ry * .34, rx * .16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  eye(70, 68, 5.1, 7.2, -.13);
  eye(94, 66, 4.6, 6.7, .12);

  // Airbrushed blush, soft mouth and tiny organic freckles.
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = "blur(3px)";
  ctx.fillStyle = "rgba(205,126,112,.3)";
  ctx.beginPath();
  ctx.ellipse(61, 80, 6, 3, -.2, 0, Math.PI * 2);
  ctx.ellipse(103, 77, 5, 2.5, -.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(75,96,76,.8)";
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(80, 83);
  ctx.quadraticCurveTo(83, 85, 86, 82);
  ctx.stroke();

  // Fine soft surface speckling, clipped to the head silhouette.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(52, 62);
  ctx.bezierCurveTo(50, 43, 64, 33, 80, 33);
  ctx.bezierCurveTo(100, 31, 113, 45, 112, 63);
  ctx.bezierCurveTo(113, 83, 101, 97, 85, 99);
  ctx.bezierCurveTo(67, 101, 53, 86, 52, 69);
  ctx.closePath();
  ctx.clip();
  for (let i = 0; i < 95; i += 1) {
    const x = 55 + ((i * 37) % 54);
    const y = 40 + ((i * 23) % 53);
    const radius = .16 + ((i * 7) % 5) * .09;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,235,.24)" : "rgba(49,77,53,.13)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Floating seed spirit and its diffuse glow.
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(5px)";
  ctx.fillStyle = "rgba(220,244,153,.5)";
  ctx.beginPath();
  ctx.arc(43, 79, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(43, 85);
  ctx.bezierCurveTo(34, 78, 39, 69, 45, 69);
  ctx.bezierCurveTo(52, 76, 49, 82, 43, 85);
  const seed = ctx.createLinearGradient(38, 69, 48, 85);
  seed.addColorStop(0, "#fffbd4");
  seed.addColorStop(.45, "#c9e88d");
  seed.addColorStop(1, "#638f4d");
  ctx.fillStyle = seed;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,250,209,.8)";
  ctx.lineWidth = .8;
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,220,.9)";
  ctx.lineWidth = .9;
  ctx.beginPath();
  ctx.moveTo(43, 83);
  ctx.quadraticCurveTo(44, 77, 45, 72);
  ctx.stroke();

  // Soft engraved botanical details on the inner enamel.
  ctx.strokeStyle = "rgba(201,222,151,.34)";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(34, 39);
  ctx.quadraticCurveTo(45, 23, 62, 22);
  ctx.moveTo(98, 22);
  ctx.quadraticCurveTo(115, 24, 126, 39);
  ctx.moveTo(34, 106);
  ctx.quadraticCurveTo(42, 114, 50, 114);
  ctx.moveTo(126, 106);
  ctx.quadraticCurveTo(118, 114, 110, 114);
  ctx.stroke();

  // Fine top-left specular glints on the metal rim.
  ctx.strokeStyle = "rgba(255,245,207,.72)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(37, 34);
  ctx.quadraticCurveTo(48, 20, 64, 18);
  ctx.moveTo(27, 67);
  ctx.quadraticCurveTo(24, 77, 28, 88);
  ctx.stroke();

  ctx.restore();
}

export default function KodamaPrototypeArtwork({ size = 76 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawKodama(ctx);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label="Kodama forest spirit collectible badge"
      title="Kodama"
      style={{ width: size, height: size }}
      className="block shrink-0 overflow-visible drop-shadow-[0_8px_12px_rgba(0,0,0,0.52)]"
    />
  );
}
