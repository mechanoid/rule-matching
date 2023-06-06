import { matcher, type Rule } from "./main.ts";

const someBlips = [{ source: "raw", altitude: 123 }, {
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

Deno.bench(function matchingWithOnlySomeBlibs() {
  someBlips.map(matcher(rules, "orange"));
});
