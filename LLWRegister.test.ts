import { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { LLWRegister } from "./LLWRegister.ts";

const baseTimestamp = Date.now();
const helloJavaScript = "hello javascript";
const helloRust = "hello rust";

Deno.test("LLWRegister basic", () => {
  const registerA = LLWRegister.empty<string>();
  const registerB = LLWRegister.empty<string>();

  registerA.set(helloJavaScript, baseTimestamp);
  registerB.set(helloRust, baseTimestamp + 1);

  assertEquals(registerA.value, helloJavaScript);
  assertEquals(registerB.value, helloRust);

  registerA.merge(registerB);
  registerB.merge(registerA);
  assertEquals(registerA.value, helloRust);
  assertEquals(registerB.value, helloRust);
});
