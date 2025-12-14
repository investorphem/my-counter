import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("Counter tests", () => {
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

  it("decrement fails when counter is 0", () => {
    const { result } = simnet.callPublicFn("counter", "decrement", [], deployer);
    expect(result).toBeErr(Cl.uint(1000));
  });

  it("set-counter works for owner", () => {
    const { result } = simnet.callPublicFn("counter", "set-counter", [Cl.uint(42)], deployer);
    expect(result).toBeOk(Cl.uint(42));
    
    const { result: counter } = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(counter).toBeUint(42);
  });

  it("set-counter fails for non-owner", () => {
    const wallet1 = accounts.get("wallet_1")!;
    const { result } = simnet.callPublicFn("counter", "set-counter", [Cl.uint(100)], wallet1);
    expect(result).toBeErr(Cl.uint(1000));
  });
});
