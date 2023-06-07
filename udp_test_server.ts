import { writeAll } from "std/streams/mod.ts";
import { matcher, Rule } from "./main.ts";

const l = Deno.listenDatagram({
  port: 10_000,
  transport: "udp",
});

console.log(`udp listener bound: ${JSON.stringify(l.addr)}`);

const dot = new TextEncoder().encode(".");
const x = new TextEncoder().encode("x");
const slash = new TextEncoder().encode("/");
const backslash = new TextEncoder().encode("\\");

const rules: Rule[] = [
  { prop: "source", check: (val: string) => val === "raw", result: dot },
  {
    prop: "altitude",
    check: (val: number) => 200 > val && val > 100,
    result: x,
  },
  {
    prop: "altitude",
    check: (val: number) => 200 < val && val < 300,
    result: slash,
  },
  {
    prop: "callsign",
    check: (val: string) => val === "abc",
    result: backslash,
  },
];

bindCleanUp(l);

let i = 0;
let seconds = 0;

try {
  const match = matcher(rules, x);
  for await (const r of l) {
    i++;
    const blip = JSON.parse(new TextDecoder().decode(r[0]));
    const res = match(blip);
    const t = performance.now();

    if (t > (seconds * 1000)) {
      seconds++;
      // console.log(seconds, i);
      i = 0;
    }

    // optionally write out the res
    await writeAll(Deno.stdout, res);
  }
} finally {
  l.close();
}

// ******************************
// SETUP STUFF
// ******************************

function bindCleanUp(l: Deno.DatagramConn) {
  const cleanup = () => {
    console.log("cleanup processes");
    l.close();
  };

  const rampDown = () => {
    console.log("rampdown");
    cleanup();
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", rampDown);
  Deno.addSignalListener("SIGTERM", rampDown);
}
