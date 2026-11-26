import { describe, expect, it } from "vitest";
import { operationalMetrics, receptionShortcuts } from "@/lib/upvet/data";
describe("Reception operational scope", () => {
  it("contains only appointments and patient metrics, not financial results", () => {
    expect(operationalMetrics.map((m) => m.key)).toEqual([
      "scheduled",
      "ongoing",
      "hospitalized",
      "vaccines",
    ]);
  });
  it("offers reception waiting queue instead of a financial shortcut", () => {
    expect(receptionShortcuts.map((s) => s.path)).toEqual([
      "/agenda",
      "/pacientes",
      "/tutores",
      "/prontuarios",
      "/estoque",
      "/atendimento",
    ]);
  });
});
