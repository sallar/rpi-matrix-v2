/**
 * Ported from https://github.com/alexeden/rpi-led-matrix
 * Because it's very difficult to build the native module for this project.
 */

export * from "./layout-utils";
export * from "./custom-types";
export * from "./utils";
import type { LedMatrixAddon } from "./custom-types";

const { Font, isSupported, LedMatrix } =
  require("./rpi-led-matrix.node") as LedMatrixAddon;
export { Font, isSupported, LedMatrix };
