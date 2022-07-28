import {
  assertArrayIncludes,
  assertEquals,
} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { ORSet } from "./ORSet.ts";

const helloJavaScript = "hello javascript";
const helloRust = "hello rust";

Deno.test("ORSet basic", () => {
  const set = ORSet.empty<string>();
  set.add(helloJavaScript);
  assertArrayIncludes([...set.value], [helloJavaScript]);
});

Deno.test("ORSet remove", () => {
  const set = ORSet.empty<string>();
  set.remove(helloJavaScript);
  set.add(helloJavaScript);
  set.add(helloRust);
  set.remove(helloJavaScript);
  set.remove(helloJavaScript);
  assertEquals(set.value.size, 1);
  assertArrayIncludes([...set.value], [helloRust]);
  set.add(helloJavaScript);
  assertEquals(set.value.size, 2);
  assertArrayIncludes([...set.value], [helloJavaScript, helloRust]);
});

Deno.test("ORSet add first", () => {
  const setA = ORSet.empty<string>();
  const setB = ORSet.empty<string>();
  setA.add(helloJavaScript);
  setB.add(helloJavaScript);
  setB.remove(helloJavaScript);
  setA.merge(setB);
  assertEquals(setA.value.size, 1);
  assertEquals(setB.value.size, 0);
  assertArrayIncludes([...setA.value], [helloJavaScript]);
});

Deno.test("ORSet merge", () => {
  const setA = ORSet.empty<string>();
  const setB = ORSet.empty<string>();

  setA.add(helloJavaScript);
  setB.add(helloRust);
  setA.merge(setB);
  assertEquals(setA.value.size, 2);
  assertArrayIncludes([...setA.value], [helloJavaScript, helloRust]);

  setA.merge(setB.remove(helloRust));
  assertEquals(setA.value.size, 1);

  setA.merge(setB.merge(setA).remove(helloJavaScript));
  assertEquals(setA.value.size, 0);
});
