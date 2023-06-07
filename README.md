# Example for matching rules to incoming Events

## UDP Example

As an example implementation the `udp_blip_generator.ts` file can be used to
test the matchers performance. It will send out a blips as fast as it is able to
(making it hard to kill the process ;) use kill -9 to get rid of the client).
Please have in mind that also JSON encoding and decoding is part of the
performance test.

The `udp_test_server.ts` receives the blips and match them against the rules.

It logs out the current "second" and the received blips in that second.

(commented out you can also log out the result of the match (`., x, /, \`))

### Usage

Open a terminal and run `deno run --allow-net --unstable udp_test_server.ts` to
start the server.

In a different terminal run
`deno run --allow-net --unstable udp_blip_generator.ts` to start sending blips.
