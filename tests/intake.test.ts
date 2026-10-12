import { describe, expect, test } from "bun:test";
import {
  introduction,
  sendInquiry,
  validateEndpoint,
} from "../src/client/intake";
describe("client inquiry delivery", () => {
  test("rejects unexpected submission destinations", () => {
    expect(() => validateEndpoint("https://example.com/f/test")).toThrow();
    expect(() =>
      validateEndpoint("https://formspree.io/f/test?redirect=other"),
    ).toThrow();
    expect(validateEndpoint("")).toBe("");
    expect(validateEndpoint("https://formspree.io/f/abcd")).toBe(
      "https://formspree.io/f/abcd",
    );
  });
  test("draft includes multiple goals and omits bot fields", () => {
    const data = new FormData();
    data.set("name", "Example Client");
    data.append("goals", "budget");
    data.append("goals", "debt");
    data.set("_gotcha", "hidden");
    data.set("notes", "");
    expect(introduction(data)).toBe(
      "Name: Example Client\nGoal: Building a budget\nGoal: Paying down debt",
    );
  });
  test("only reports success after Formspree accepts the request", async () => {
    const data = new FormData();
    data.set("email", "example@example.com");
    const request = async (url: string, options: RequestInit) => {
      expect(url).toBe("https://formspree.io/f/abcd");
      expect(options.body).toBe(data);
      expect(options.method).toBe("POST");
      return new Response("{}", { status: 200 });
    };
    await expect(
      sendInquiry("https://formspree.io/f/abcd", data, request),
    ).resolves.toBeUndefined();
  });
  test("surfaces provider and network failures", async () => {
    const rejected = async () => new Response("{}", { status: 422 });
    await expect(
      sendInquiry("https://formspree.io/f/abcd", new FormData(), rejected),
    ).rejects.toThrow();
    const offline = async () => {
      throw new Error("offline");
    };
    await expect(
      sendInquiry("https://formspree.io/f/abcd", new FormData(), offline),
    ).rejects.toThrow("offline");
    await expect(sendInquiry("", new FormData(), offline)).rejects.toThrow(
      "not configured",
    );
  });
});
