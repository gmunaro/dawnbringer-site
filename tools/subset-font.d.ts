// subset-font ships no types; this is the part the build uses.
declare module "subset-font" {
  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: { targetFormat?: "sfnt" | "woff" | "woff2"; preserveNameIds?: number[] },
  ): Promise<Buffer>;
}
