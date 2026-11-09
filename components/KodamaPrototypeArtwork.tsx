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

  // Layered silver metal badge rim for the Common rarity.
  const rim = ctx.createLinearGradient(22, 15, 138, 143);
  rim.addColorStop(0, "#ffffff");
  rim.addColorStop(.13, "#cbd0d1");
  rim.addColorStop(.34, "#626b70");
  rim.addColorStop(.56, "#eef1ef");
  rim.addColorStop(.78, "#7c8588");
  rim.addColorStop(1, "#f8faf7");
  ctx.fillStyle = rim;
  ctx.strokeStyle = "#3b4245";
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
    [0, "#899492"], [.42, "#586260"], [.78, "#343d3c"], [1, "#202827"],
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


function drawKodamaLevel2(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.scale(SIZE / 160, SIZE / 160);
  ctx.clearRect(0, 0, 160, 160);

  // Keep the same collectible frame language, while giving the evolved
  // spirit a completely new silhouette and pose.
  const framePath = () => {
    // Clean, compact seed-shaped medallion for Kodama's evolved form.
    ctx.beginPath();
    ctx.moveTo(80, 7);
    ctx.bezierCurveTo(98, 8, 116, 17, 127, 32);
    ctx.bezierCurveTo(139, 47, 142, 66, 139, 87);
    ctx.bezierCurveTo(136, 111, 119, 128, 101, 139);
    ctx.lineTo(80, 151);
    ctx.lineTo(59, 139);
    ctx.bezierCurveTo(41, 128, 24, 111, 21, 87);
    ctx.bezierCurveTo(18, 66, 21, 47, 33, 32);
    ctx.bezierCurveTo(44, 17, 62, 8, 80, 7);
    ctx.closePath();
  };

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.62)";
  ctx.shadowBlur = 13;
  ctx.shadowOffsetY = 7;
  framePath();
  ctx.fillStyle = "#13251b";
  ctx.fill();
  ctx.restore();

  const rim = ctx.createLinearGradient(22, 15, 138, 143);
  [["0","#ffffff"],[".13","#cbd0d1"],[".34","#626b70"],[".56","#eef1ef"],[".78","#7c8588"],["1","#f8faf7"]].forEach(([p,c]) => rim.addColorStop(Number(p), c));
  framePath();
  ctx.fillStyle = rim;
  ctx.strokeStyle = "#3b4245";
  ctx.lineWidth = 2.5;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 14);
  ctx.bezierCurveTo(96, 15, 111, 23, 121, 36);
  ctx.bezierCurveTo(132, 49, 135, 66, 132, 86);
  ctx.bezierCurveTo(129, 106, 114, 121, 97, 132);
  ctx.lineTo(80, 143);
  ctx.lineTo(63, 132);
  ctx.bezierCurveTo(46, 121, 31, 106, 28, 86);
  ctx.bezierCurveTo(25, 66, 28, 49, 39, 36);
  ctx.bezierCurveTo(49, 23, 64, 15, 80, 14);
  ctx.closePath();
  ctx.fillStyle = radial(ctx, 65, 45, 112, [[0,"#899492"],[.45,"#586260"],[.82,"#343d3c"],[1,"#202827"]]);
  ctx.fill();

  // A sweeping breeze trail gives the new pose movement.
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(5px)";
  ctx.strokeStyle = "rgba(188,225,142,.38)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(29, 112);
  ctx.bezierCurveTo(48, 128, 91, 130, 126, 101);
  ctx.stroke();
  ctx.restore();

  // Rear branch antlers, asymmetrical to keep the silhouette lively.
  ctx.lineCap = "round";
  ctx.strokeStyle = "#76563a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(74, 52);
  ctx.quadraticCurveTo(56, 31, 49, 16);
  ctx.moveTo(84, 49);
  ctx.quadraticCurveTo(99, 26, 119, 20);
  ctx.moveTo(55, 30);
  ctx.quadraticCurveTo(43, 27, 37, 18);
  ctx.moveTo(105, 31);
  ctx.quadraticCurveTo(108, 16, 105, 10);
  ctx.stroke();

  function sprig(x: number, y: number, angle: number, scale: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    const leafShape = (dx: number, dy: number, flip: number) => {
      ctx.save();
      ctx.translate(dx, dy);
      ctx.scale(flip, 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-12, -15, -9, -25, 1, -23);
      ctx.bezierCurveTo(13, -18, 12, -7, 0, 0);
      const g = ctx.createLinearGradient(-8, -24, 8, 0);
      g.addColorStop(0, "#f4f2bd");
      g.addColorStop(.3, "#c9df83");
      g.addColorStop(.72, "#6f9a49");
      g.addColorStop(1, "#294a30");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "rgba(34,66,39,.9)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,248,206,.75)";
      ctx.lineWidth = .8;
      ctx.beginPath();
      ctx.moveTo(0, -1);
      ctx.quadraticCurveTo(1, -11, 1, -21);
      ctx.stroke();
      ctx.restore();
    };
    leafShape(-5, 0, 1);
    leafShape(5, -1, -1);
    ctx.restore();
  }
  sprig(48, 18, -.4, .85);
  sprig(118, 20, .5, 1);
  sprig(104, 12, .05, .65);

  // New Level 2 body: a nimble, twisting sapling spirit with a bark torso,
  // root-kick legs and a broad leaf mantle—not an enlarged Level 1 head.
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.55)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.moveTo(76, 67);
  ctx.bezierCurveTo(91, 68, 103, 82, 100, 100);
  ctx.bezierCurveTo(98, 117, 82, 124, 68, 116);
  ctx.bezierCurveTo(54, 108, 54, 89, 62, 77);
  ctx.closePath();
  const bark = ctx.createLinearGradient(58, 72, 101, 119);
  bark.addColorStop(0, "#e5d8ad");
  bark.addColorStop(.22, "#b5a078");
  bark.addColorStop(.52, "#806044");
  bark.addColorStop(.78, "#4c4934");
  bark.addColorStop(1, "#273d2e");
  ctx.fillStyle = bark;
  ctx.fill();
  ctx.restore();

  // Curved root tail and two expressive root legs.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#76583d";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(67, 107);
  ctx.bezierCurveTo(48, 119, 40, 133, 25, 126);
  ctx.bezierCurveTo(15, 121, 23, 112, 31, 114);
  ctx.moveTo(79, 112);
  ctx.quadraticCurveTo(87, 128, 103, 128);
  ctx.quadraticCurveTo(113, 128, 116, 119);
  ctx.stroke();
  ctx.strokeStyle = "rgba(235,214,165,.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(64, 112);
  ctx.quadraticCurveTo(47, 125, 31, 123);
  ctx.moveTo(84, 117);
  ctx.quadraticCurveTo(99, 132, 111, 123);
  ctx.stroke();

  // A leaf mantle flares behind the torso like a little forest cloak.
  const mantle = ctx.createLinearGradient(34, 69, 110, 111);
  mantle.addColorStop(0, "#e4e9a5");
  mantle.addColorStop(.25, "#9fbd67");
  mantle.addColorStop(.62, "#557d43");
  mantle.addColorStop(1, "#233f2d");
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.5)";
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.moveTo(67, 75);
  ctx.bezierCurveTo(49, 67, 35, 73, 29, 91);
  ctx.bezierCurveTo(42, 91, 47, 103, 58, 112);
  ctx.bezierCurveTo(62, 96, 71, 91, 82, 91);
  ctx.bezierCurveTo(96, 105, 109, 101, 121, 91);
  ctx.bezierCurveTo(112, 74, 98, 68, 84, 75);
  ctx.closePath();
  ctx.fillStyle = mantle;
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(245,244,190,.8)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(35, 88);
  ctx.quadraticCurveTo(55, 87, 64, 104);
  ctx.moveTo(115, 88);
  ctx.quadraticCurveTo(96, 85, 84, 103);
  ctx.stroke();

  // One branch arm reaches forward; the other trails behind in the leap.
  ctx.lineCap = "round";
  ctx.strokeStyle = "#896c49";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(60, 82);
  ctx.quadraticCurveTo(44, 78, 39, 61);
  ctx.moveTo(91, 83);
  ctx.quadraticCurveTo(110, 72, 111, 56);
  ctx.stroke();
  sprig(38, 60, -.55, .52);
  sprig(112, 55, .5, .55);

  // Head is turned in three-quarter profile, tucked under the antlers.
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.58)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  ctx.beginPath();
  ctx.moveTo(55, 54);
  ctx.bezierCurveTo(50, 39, 59, 26, 75, 25);
  ctx.bezierCurveTo(92, 23, 104, 35, 102, 51);
  ctx.bezierCurveTo(101, 67, 90, 77, 75, 76);
  ctx.bezierCurveTo(62, 75, 55, 67, 55, 54);
  ctx.closePath();
  const face = ctx.createRadialGradient(68, 36, 2, 83, 53, 43);
  face.addColorStop(0, "#fff9df");
  face.addColorStop(.22, "#e9e7c9");
  face.addColorStop(.48, "#c4d0aa");
  face.addColorStop(.76, "#829b70");
  face.addColorStop(1, "#405b3f");
  ctx.fillStyle = face;
  ctx.fill();
  ctx.restore();

  // Mossy brow ridge and small leaf tufts frame the face.
  ctx.beginPath();
  ctx.moveTo(55, 48);
  ctx.bezierCurveTo(53, 35, 63, 29, 72, 32);
  ctx.bezierCurveTo(81, 23, 95, 31, 101, 42);
  ctx.bezierCurveTo(91, 39, 86, 43, 80, 47);
  ctx.bezierCurveTo(70, 41, 64, 46, 55, 48);
  ctx.closePath();
  const mossBrow = ctx.createLinearGradient(58, 28, 99, 48);
  mossBrow.addColorStop(0, "#e9f0ad");
  mossBrow.addColorStop(1, "#496d3b");
  ctx.fillStyle = mossBrow;
  ctx.fill();

  // One visible glossy eye and a smaller far eye sell the turned pose.
  ctx.save();
  ctx.fillStyle = "#14251d";
  ctx.beginPath();
  ctx.ellipse(72, 54, 4.6, 6.2, -.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffef1";
  ctx.beginPath();
  ctx.ellipse(70.5, 51.5, 1.6, 2, -.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#26392a";
  ctx.beginPath();
  ctx.ellipse(91, 51, 2.7, 4.3, .1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,240,.9)";
  ctx.beginPath();
  ctx.arc(90.3, 49.4, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tiny smile, cheek warmth and bark grain.
  ctx.strokeStyle = "rgba(77,94,66,.9)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(78, 64);
  ctx.quadraticCurveTo(82, 67, 86, 63);
  ctx.stroke();
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = "blur(3px)";
  ctx.fillStyle = "rgba(204,133,111,.35)";
  ctx.beginPath();
  ctx.ellipse(63, 64, 5, 2.5, -.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(241,220,171,.58)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(69, 83);
  ctx.quadraticCurveTo(75, 94, 70, 108);
  ctx.moveTo(83, 83);
  ctx.quadraticCurveTo(88, 96, 82, 112);
  ctx.stroke();

  // Firefly seed orb: a small forest-spirit companion, not a generic sparkle.
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(6px)";
  ctx.fillStyle = "rgba(225,246,157,.6)";
  ctx.beginPath();
  ctx.arc(36, 45, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(36, 52);
  ctx.bezierCurveTo(25, 43, 32, 33, 38, 34);
  ctx.bezierCurveTo(47, 41, 43, 48, 36, 52);
  const orb = ctx.createLinearGradient(30, 33, 42, 52);
  orb.addColorStop(0, "#fffbd5");
  orb.addColorStop(.48, "#d5ed9d");
  orb.addColorStop(1, "#668e4a");
  ctx.fillStyle = orb;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,250,210,.8)";
  ctx.lineWidth = .8;
  ctx.stroke();

  // Flecks of moss and floating pollen, kept sparse at small display sizes.
  [[58,39,1.3],[96,39,1],[47,83,1.1],[109,91,1.4],[70,119,1]].forEach(([x,y,r],i) => {
    ctx.fillStyle = i % 2 ? "rgba(244,246,192,.85)" : "rgba(188,218,127,.8)";
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  });
  ctx.restore();
}

export default function KodamaPrototypeArtwork({ size = 76, level = 1 }: { size?: number; level?: 1 | 2 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (level === 2) drawKodamaLevel2(ctx); else drawKodama(ctx);
  }, [level]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label={level === 2 ? "Kodama, evolved forest spirit collectible badge" : "Kodama forest spirit collectible badge"}
      title="Kodama"
      style={{ width: size, height: size }}
      className="block shrink-0 overflow-visible drop-shadow-[0_8px_12px_rgba(0,0,0,0.52)]"
    />
  );
}
