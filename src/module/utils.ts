import { type PixelMapper, PixelMapperType } from "./custom-types";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class LedMatrixUtils {
  static encodeMappers(...mappers: PixelMapper[]): string {
    return mappers
      .map((mapper) => {
        switch (mapper.type) {
          case PixelMapperType.Chainlink:
            return PixelMapperType.Chainlink;
          case PixelMapperType.Rotate:
            return [PixelMapperType.Rotate, mapper.angle].join(":");
          case PixelMapperType.U:
            return PixelMapperType.U;
          case PixelMapperType.V:
            return PixelMapperType.V;
          case PixelMapperType.VZ:
            return PixelMapperType.VZ;
        }
      })
      .join(";");
  }
}
