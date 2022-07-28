import {
  assertArrayIncludes,
  assertEquals,
} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { ORSet } from "./ORSet.ts";

const helloJavaScript = "hello javascript";
const helloRust = "hello rust";

Deno.test("ORSet basic", () => {
  const register = ORSet.empty<string>();
  register.add(helloJavaScript);
  assertArrayIncludes([...register.value], [helloJavaScript]);
});

Deno.test("ORSet remove", () => {
  const register = ORSet.empty<string>();
  register.remove(helloJavaScript);
  register.add(helloJavaScript);
  register.add(helloRust);
  register.remove(helloJavaScript);
  register.remove(helloJavaScript);
  assertEquals(register.value.size, 1);
  assertArrayIncludes([...register.value], [helloRust]);
  register.add(helloJavaScript);
  assertEquals(register.value.size, 2);
  assertArrayIncludes([...register.value], [helloJavaScript, helloRust]);
});

Deno.test("ORSet add first", () => {
  const registerA = ORSet.empty<string>();
  const registerB = ORSet.empty<string>();
  registerA.add(helloJavaScript);
  registerB.add(helloJavaScript);
  registerB.remove(helloJavaScript);
  registerA.merge(registerB);
  assertEquals(registerA.value.size, 1);
  assertEquals(registerB.value.size, 0);
  assertArrayIncludes([...registerA.value], [helloJavaScript]);
});

Deno.test("ORSet merge", () => {
  const registerA = ORSet.empty<string>();
  const registerB = ORSet.empty<string>();

  registerA.add(helloJavaScript);
  registerB.add(helloRust);
  registerA.merge(registerB);
  assertEquals(registerA.value.size, 2);
  assertArrayIncludes([...registerA.value], [helloJavaScript, helloRust]);

  registerA.merge(registerB.remove(helloRust));
  assertEquals(registerA.value.size, 1);

  registerA.merge(registerB.merge(registerA).remove(helloJavaScript));
  assertEquals(registerA.value.size, 0);
});
