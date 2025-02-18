import { Font, type LedMatrixInstance } from "../module";
import { wait } from "../utils";

const font = new Font("font", "./fonts/4x6.bdf");

/**
 * Convert fraction f ∈ [0, 1) to a point (x, y) along the rectangle's perimeter
 * in a clockwise direction, **starting at top-center** instead of top-left.
 *
 * top-center (fraction=0) → top-right corner → bottom-right corner → bottom-left corner → top-left corner → back to top-center
 */
function perimeterPointTopCenter(
  f: number,
  w: number,
  h: number,
): [number, number] {
  const perimeter = 2 * (w + h);

  // The offset that turns top-center into fraction=0:
  // top-left corner is distance=0, so top-center is distance = w/2 from the top-left corner.
  const offset = w / 2;

  // Distance along the perimeter, wrapping around if needed.
  // e.g. if offset + fraction*perimeter >= perimeter, wrap back around.
  const dist = (f * perimeter + offset) % perimeter;

  // Now do the same segment checks, but with `dist` as your 0-based distance
  // from the top-left corner, going clockwise:
  if (dist <= w) {
    // top edge (from x=offset to x=w, y=0)
    return [dist, 0];
  } else if (dist <= w + h) {
    // right edge
    return [w, dist - w];
  } else if (dist <= w + h + w) {
    // bottom edge
    const offset2 = dist - (w + h);
    return [w - offset2, h];
  } else {
    // left edge
    const offset3 = dist - (w + h + w);
    return [0, h - offset3];
  }
}

/**
 * Draw the rectangular clock onto the matrix.
 */
function drawRectangularClock(matrix: LedMatrixInstance): void {
  const w = matrix.width(); // 64
  const h = matrix.height(); // 32
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);

  // Clear and fill the background (optional)
  matrix.clear();

  // Current time
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Fractions of the perimeter: [0,1)
  const hourFrac = (hours + minutes / 60 + seconds / 3600) / 12;
  const minuteFrac = (minutes + seconds / 60) / 60;
  const secondFrac = seconds / 60;

  // Convert those fractions to perimeter coordinates
  const [hx, hy] = perimeterPointTopCenter(hourFrac, w, h);
  const [mx, my] = perimeterPointTopCenter(minuteFrac, w, h);
  const [sx, sy] = perimeterPointTopCenter(secondFrac, w, h);

  // Define how long each hand is (ratio of distance from center to perimeter).
  const hourLength = 0.6;
  const minuteLength = 0.8;
  const secondLength = 0.95;

  // Utility to interpolate between two points:
  function handCoords(
    cx: number,
    cy: number,
    px: number,
    py: number,
    length: number,
  ): [number, number] {
    const dx = px - cx;
    const dy = py - cy;
    return [Math.round(cx + length * dx), Math.round(cy + length * dy)];
  }

  // Calculate final coords for hour, minute, second hands
  const [hxFinal, hyFinal] = handCoords(cx, cy, hx, hy, hourLength);
  const [mxFinal, myFinal] = handCoords(cx, cy, mx, my, minuteLength);
  const [sxFinal, syFinal] = handCoords(cx, cy, sx, sy, secondLength);

  // Draw hour, minute, second hands in different colors
  matrix.fgColor(0xff0000); // red for hour
  matrix.drawLine(cx, cy, hxFinal, hyFinal);

  matrix.fgColor(0x00ff00); // green for minute
  matrix.drawLine(cx, cy, mxFinal, myFinal);

  matrix.fgColor(0xffff00); // yellow for second
  matrix.drawLine(cx, cy, sxFinal, syFinal);

  // Draw 12 hour markers on the perimeter
  for (let i = 0; i < 12; i++) {
    const frac = i / 12;
    const [px, py] = perimeterPointTopCenter(frac, w, h);

    // Move slightly inward to form a "tick mark"
    const inwardFrac = 0.9;
    const [tx, ty] = handCoords(cx, cy, px, py, inwardFrac);

    matrix.fgColor(0xffffff);
    matrix.drawLine(px, py, tx, ty);
  }

  matrix.font(font);
  const dateStr = now.toLocaleDateString("fi-FI", {
    month: "2-digit",
    day: "2-digit",
  });

  const xDate = 6;
  const yDate = 14;

  matrix.fgColor(0xffffff);
  matrix.drawText(dateStr, xDate, yDate);

  matrix.sync();
}

export const run = async (matrix: LedMatrixInstance) => {
  try {
    while (true) {
      drawRectangularClock(matrix);
      await wait(1000); // update once per second
    }
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
};
