import sourceMapJsModule from "source-map-js/source-map.js";

type SourceMapJsModule = typeof import("source-map-js/source-map.js");

const maybeDefaultSourceMapJs = sourceMapJsModule as SourceMapJsModule & {
  default?: SourceMapJsModule;
};
const sourceMapJs = maybeDefaultSourceMapJs.default ?? maybeDefaultSourceMapJs;

export const SourceMapConsumer = sourceMapJs.SourceMapConsumer;
export const SourceMapGenerator = sourceMapJs.SourceMapGenerator;
export const SourceNode = sourceMapJs.SourceNode;

export default sourceMapJs;
