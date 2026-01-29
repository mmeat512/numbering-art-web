declare module 'potrace' {
  interface TraceOptions {
    threshold?: number    // 0-255, threshold for turning color pixel into white/black
    turdSize?: number     // minimum size of any output path, smaller than ignored
    optTolerance?: number // 0-1, amount of curve optimization
    color?: string        // foreground color
    background?: string   // background color
  }

  type TraceCallback = (err: Error | null, svg: string) => void

  function trace(
    file: string | Buffer,
    options: TraceOptions,
    callback: TraceCallback
  ): void

  function trace(
    file: string | Buffer,
    callback: TraceCallback
  ): void

  export { trace, TraceOptions, TraceCallback }
}
