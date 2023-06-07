const client = Deno.listenDatagram({
  port: 0, // servers connect to a non-zero port, clients to 0
  transport: "udp",
});

const peerAddr: Deno.NetAddr = {
  transport: "udp",
  hostname: "127.0.0.1",
  port: 10000,
};

let close = false;
let i = 0;
let seconds = 0;

const blipGenerator = () =>
  [{ source: "raw", altitude: 123 }, {
    source: "aggregate",
    callsign: "abc",
  }][Math.round(Math.random())];

bindCleanUp();

while (true) {
  const blip = new TextEncoder().encode(JSON.stringify(blipGenerator()));
  if (close) {
    client.close();
    Deno.exit(0);
  }

  i++;
  const t = performance.now();

  if (t > (seconds * 1000)) {
    seconds++;
    console.log(seconds, i);
    i = 0;
  }

  await client.send(blip, peerAddr);
}

function bindCleanUp() {
  const cleanup = () => {
    console.log("cleanup processes");
    close = true;
  };

  const rampDown = () => {
    console.log("rampdown");
    cleanup();
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", rampDown);
  Deno.addSignalListener("SIGTERM", rampDown);
}
