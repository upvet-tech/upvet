import { describe, expect, it } from "vitest";
import { operationalMetrics } from "@/lib/upvet/data";
describe("Reception operational scope", () => {
  it("contains only appointments and patient metrics, not financial results", () => {
    expect(operationalMetrics.map((m) => m.key)).toEqual([
      "scheduled",
      "completed",
      "patients",
      "pending",
    ]);
  });
});
