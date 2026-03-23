import type { Component } from "solid-js";

export interface HomepageInfographicDefinition {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  component: Component;
}
