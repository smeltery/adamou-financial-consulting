import { test, expect } from "bun:test";
import { blankClient, transition, summarize } from "../src/model";
import { parseIntake } from "../../../packages/intake";
test("onboarding is repeatable and conversion tracks clients who started", () => {
  let client = transition(blankClient(), "onboarding");
  expect(transition(client, "onboarding").checklist).toHaveLength(3);
  client = transition(client, "active");
  client = transition(client, "archived");
  expect(summarize([client]).conversion).toBe(100);
  expect(summarize([client]).active).toBe(0);
  expect(transition(client, "active").archived_at).toBeNull();
  expect(summarize([]).conversion).toBeNull();
});
test("intake validates required fields and strips unexpected data", () => {
  expect(
    parseIntake({
      name: " Test ",
      email: "a@example.com",
      _internal: "secret",
      goals: ["budget", "debt"],
    }),
  ).toEqual({
    name: "Test",
    email: "a@example.com",
    goals: ["budget", "debt"],
  });
  expect(() => parseIntake({ name: "Test", email: "invalid" })).toThrow();
  expect(() =>
    parseIntake({ name: "Test", email: "a@example.com", notes: {} }),
  ).toThrow();
});
