import sourceMapJsModule from "source-map-js/source-map.js";

const sourceMapJs = (sourceMapJsModule as any).default ?? sourceMapJsModule;

export const SourceMapConsumer = sourceMapJs.SourceMapConsumer;
export const SourceMapGenerator = sourceMapJs.SourceMapGenerator;
export const SourceNode = sourceMapJs.SourceNode;

export default sourceMapJs;
