import { assertEquals } from "https://deno.land/std@0.189.0/testing/asserts.ts";
import { matcher, type Rule } from "./main.ts";

Deno.test(function matcherTest() {
  const blips = [{ source: "raw", altitude: 123 }, {
    source: "aggregate",
    callsign: "abc",
  }];

  const rules: Rule[] = [
    { prop: "source", check: (val: string) => val === "raw", result: "blue" },
    {
      prop: "altitude",
      check: (val: number) => 200 > val && val > 100,
      result: "red",
    },
    {
      prop: "altitude",
      check: (val: number) => 200 < val && val < 300,
      result: "green",
    },
    {
      prop: "callsign",
      check: (val: string) => val === "abc",
      result: "purple",
    },
  ];

  const result = blips.map(matcher(rules, "orange"));
  assertEquals(result, ["blue", "purple"]);
});

Deno.test(function matcherTest() {
  const blips = [{ source: "raw", altitude: 123 }, {
    source: "aggregate",
    callsign: "abc",
  }];

  const rules: Rule[] = [
    {
      prop: "altitude",
      check: (val: string) => val === "invalid",
      result: "red",
    },
    {
      prop: "altitude",
      check: (val: number) => 200 > val && val > 100,
      result: "green",
    },
  ];

  const result = blips.map(matcher(rules, "orange"));
  assertEquals(result, ["green", "orange"]);
});
