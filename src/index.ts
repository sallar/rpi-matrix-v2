import { run } from "./apps/analog-clock";
import { GpioMapping, LedMatrix } from "./module";

const matrix = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 32,
    cols: 64,
    chainLength: 1,
    hardwareMapping: GpioMapping.AdafruitHat,
    parallel: 1,
    ledRgbSequence: "RBG",
  },
  LedMatrix.defaultRuntimeOptions(),
);

// Graceful exit on Ctrl+C
process.on("SIGINT", () => {
  console.log("Received SIGINT");
  matrix.clear();
  matrix.sync();
  process.exit(0);
});

run(matrix);
