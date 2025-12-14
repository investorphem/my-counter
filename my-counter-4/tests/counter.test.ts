import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Counter - Basic Operations", () => {
  it("default value is 0", () => {
    const { result } = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(result).toBeUint(0);
  });

  it("increment works", () => {
    const { result } = simnet.callPublicFn("counter", "increment", [], deployer);
    expect(result).toBeOk(Cl.uint(1));
    
    const { result: counter } = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(counter).toBeUint(1);
  });

  it("decrement works", () => {
    simnet.callPublicFn("counter", "increment", [], deployer);
    simnet.callPublicFn("counter", "increment", [], deployer);
    
    const { result } = simnet.callPublicFn("counter", "decrement", [], deployer);
    expect(result).toBeOk(Cl.uint(1));
    
    const { result: counter } = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(counter).toBeUint(1);
  });

  it("decrement fails with underflow error when counter is 0", () => {
    const { result } = simnet.callPublicFn("counter", "decrement", [], deployer);
    expect(result).toBeErr(Cl.uint(1001)); // ERR_UNDERFLOW
  });
});

describe("Counter - Owner Controls", () => {
  it("set-counter works for owner", () => {
    const { result } = simnet.callPublicFn("counter", "set-counter", [Cl.uint(42)], deployer);
    expect(result).toBeOk(Cl.uint(42));
    
    const { result: counter } = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(counter).toBeUint(42);
  });

  it("set-counter fails for non-owner", () => {
    const { result } = simnet.callPublicFn("counter", "set-counter", [Cl.uint(100)], wallet1);
    expect(result).toBeErr(Cl.uint(1000)); // ERR_NOT_OWNER
  });

  it("get-owner returns deployer", () => {
    const { result } = simnet.callReadOnlyFn("counter", "get-owner", [], deployer);
    expect(result).toBePrincipal(deployer);
  });

  it("transfer-ownership works for owner", () => {
    const { result } = simnet.callPublicFn("counter", "transfer-ownership", [Cl.principal(wallet1)], deployer);
    expect(result).toBeOk(Cl.bool(true));
    
    const { result: newOwner } = simnet.callReadOnlyFn("counter", "get-owner", [], deployer);
    expect(newOwner).toBePrincipal(wallet1);
  });

  it("transfer-ownership fails for non-owner", () => {
    const { result } = simnet.callPublicFn("counter", "transfer-ownership", [Cl.principal(wallet1)], wallet1);
    expect(result).toBeErr(Cl.uint(1000)); // ERR_NOT_OWNER
  });
});

describe("Counter - Pause Functionality", () => {
  it("is-paused returns false by default", () => {
    const { result } = simnet.callReadOnlyFn("counter", "is-paused", [], deployer);
    expect(result).toBeBool(false);
  });

  it("toggle-pause works for owner", () => {
    const { result } = simnet.callPublicFn("counter", "toggle-pause", [], deployer);
    expect(result).toBeOk(Cl.bool(true));
    
    const { result: paused } = simnet.callReadOnlyFn("counter", "is-paused", [], deployer);
    expect(paused).toBeBool(true);
  });

  it("toggle-pause fails for non-owner", () => {
    const { result } = simnet.callPublicFn("counter", "toggle-pause", [], wallet1);
    expect(result).toBeErr(Cl.uint(1000)); // ERR_NOT_OWNER
  });

  it("increment fails when paused", () => {
    simnet.callPublicFn("counter", "toggle-pause", [], deployer);
    
    const { result } = simnet.callPublicFn("counter", "increment", [], deployer);
    expect(result).toBeErr(Cl.uint(1002)); // ERR_PAUSED
  });

  it("decrement fails when paused", () => {
    simnet.callPublicFn("counter", "increment", [], deployer);
    simnet.callPublicFn("counter", "toggle-pause", [], deployer);
    
    const { result } = simnet.callPublicFn("counter", "decrement", [], deployer);
    expect(result).toBeErr(Cl.uint(1002)); // ERR_PAUSED
  });
});
