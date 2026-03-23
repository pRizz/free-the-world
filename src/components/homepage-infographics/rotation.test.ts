import { expect, test } from "bun:test";
import {
  normalizeHomepageInfographicId,
  pickRandomHomepageInfographicId,
} from "~/components/homepage-infographics/rotation";

test("normalizeHomepageInfographicId returns null for an unknown infographic", () => {
  // Arrange
  const infographicIds = ["capital-at-risk", "post-bubble"];

  // Act
  const normalizedInfographicId = normalizeHomepageInfographicId(infographicIds, "unknown");

  // Assert
  expect(normalizedInfographicId).toBeNull();
});

test("pickRandomHomepageInfographicId excludes the current infographic when possible", () => {
  // Arrange
  const infographicIds = ["capital-at-risk", "post-bubble", "alternative-pressure"];

  // Act
  const nextInfographicId = pickRandomHomepageInfographicId(infographicIds, "post-bubble", 0.4);

  // Assert
  expect(nextInfographicId).toBe("alternative-pressure");
});

test("pickRandomHomepageInfographicId falls back to the only infographic", () => {
  // Arrange
  const infographicIds = ["capital-at-risk"];

  // Act
  const nextInfographicId = pickRandomHomepageInfographicId(infographicIds, "capital-at-risk", 0.8);

  // Assert
  expect(nextInfographicId).toBe("capital-at-risk");
});
