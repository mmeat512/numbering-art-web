declare module 'quantize' {
  type RGB = [number, number, number]

  interface ColorMap {
    palette(): RGB[]
    map(pixel: RGB): RGB | null
  }

  function quantize(
    pixels: RGB[],
    colorCount: number
  ): ColorMap | null

  export = quantize
}
