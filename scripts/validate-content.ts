import { compileContent } from "./lib/content";

const { graph } = await compileContent();

console.log(
  `Validated content: ${graph.companies.length} companies, ${graph.products.length} products, ${graph.alternatives.length} alternatives, ${graph.disruptionConcepts.length} disruption concepts, ${graph.sources.length} sources.`,
);
