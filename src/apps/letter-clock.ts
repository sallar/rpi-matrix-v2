import { Font, type LedMatrixInstance } from "../module";
import { wait } from "../utils";

const bigFont = new Font("myFont", "./fonts/7x14B.bdf");
const FONT_WIDTH = 7;
const FONT_HEIGHT = 14;


const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * Draws the time (HH:MM:SS) using big letters, centered on the panel.
 */
function drawTextClock(matrix: LedMatrixInstance) {
  matrix.clear();

  const dayLine = dayFormatter.format(new Date());
  const timeLine = timeFormatter.format(new Date());

  const dayLineWidth = dayLine.length * FONT_WIDTH;
  const timeLineWidth = timeLine.length * FONT_WIDTH;

  const dayLineX = (matrix.width() - dayLineWidth) / 2; 
  const timeLineX = (matrix.width() - timeLineWidth) / 2;
  const initialY = matrix.height() - (FONT_HEIGHT * 2 + 2);

  matrix.font(bigFont);
  matrix.fgColor({r: 255, g: 220, b: 0});
  matrix.drawText(dayLine, dayLineX, initialY);
  matrix.drawText(timeLine, timeLineX, initialY + FONT_HEIGHT);

  matrix.sync();
}

export const run = async (matrix: LedMatrixInstance) => {
  try {
    matrix.brightness(100);
    while (true) {
      drawTextClock(matrix);
      await wait(1000); // update once per second
    }
  } catch (error) {
    console.error(`${__filename} caught: `, error);
  }
};
