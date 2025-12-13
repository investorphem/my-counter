import {
  Clarinet,
  Tx,
  Chain,
  Account,
  assertEquals,
  types,
} from "https://deno.land/x/clarinet@v4.0.0/mod.ts";

Clarinet.test({
  name: "Counter: default value is 0",
  fn: async (chain: Chain, accounts: Record<string, Account>) => {
    const deployer = accounts.deployer;
    const result = chain.callReadOnlyFn("counter", "get-counter", [], deployer.address);
    assertEquals(result.result, types.uint(0));
  },
});

Clarinet.test({
  name: "Counter: increment works",
  fn: async (chain: Chain, accounts: Record<string, Account>) => {
    const { deployer } = accounts;
    const incTx = chain.mineBlock([
      Tx.contractCall("counter", "increment", [], deployer.address),
    ]);
    incTx.receipts[0].result.expectOk().expectUint(1);
    const read = chain.callReadOnlyFn("counter", "get-counter", [], deployer.address);
    assertEquals(read.result, types.uint(1));
  },
});

Clarinet.test({
  name: "Counter: decrement underflow fails",
  fn: async (chain: Chain, accounts: Record<string, Account>) => {
    const { deployer } = accounts;
    const decTx = chain.mineBlock([
      Tx.contractCall("counter", "decrement", [], deployer.address),
    ]);
    decTx.receipts[0].result.expectErr().expectUint(1001); // ERR_UNDERFLOW
  },
});

Clarinet.test({
  name: "Counter: set-counter only owner",
  fn: async (chain: Chain, accounts: Record<string, Account>) => {
    const { deployer, wallet_1 } = accounts;

    // Owner can set
    const setTx = chain.mineBlock([
      Tx.contractCall("counter", "set-counter", [types.uint(42)], deployer.address),
    ]);
    setTx.receipts[0].result.expectOk().expectUint(42);

    // Non-owner fails
    const badTx = chain.mineBlock([
      Tx.contractCall("counter", "set-counter", [types.uint(7)], wallet_1.address),
    ]);
    badTx.receipts[0].result.expectErr().expectUint(1000); // ERR_NOT_OWNER
  },
});
