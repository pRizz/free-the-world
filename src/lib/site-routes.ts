import { companies, products } from "./content-graph";

const rawRoutes = [
  "/",
  "/404",
  "/about",
  "/companies",
  "/insights",
  "/insights/alternative-pressure",
  "/insights/capital-at-risk",
  "/insights/disruption-concepts",
  "/insights/post-bubble",
  "/mirrors",
  "/methodology",
  ...companies.flatMap((company) => [
    `/companies/${company.slug}`,
    `/companies/${company.slug}/products`,
  ]),
  ...products.map((product) => `/companies/${product.companySlug}/products/${product.slug}`),
];

export const staticRoutes = Array.from(new Set(rawRoutes)).sort(compareRoutes);
export const indexableRoutes = staticRoutes.filter((route) => route !== "/404");

function compareRoutes(left: string, right: string) {
  if (left === "/") {
    return -1;
  }

  if (right === "/") {
    return 1;
  }

  return left.localeCompare(right);
}
