import { compileContent, generatedGraphFile, writeGeneratedContentGraph } from "./lib/content";

const { graph } = await compileContent();
await writeGeneratedContentGraph(graph, generatedGraphFile);

console.log(
  `Compiled content graph with ${graph.companies.length} companies, ${graph.products.length} products, ${graph.alternatives.length} alternatives, ${graph.disruptionConcepts.length} disruption concepts, and ${graph.sources.length} sources.`,
);
