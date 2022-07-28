import {
  assertArrayIncludes,
} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { GSet } from "./GSet.ts";

const helloJavaScript = "hello javascript";
const helloRust = "hello rust";

Deno.test("GSet basic", () => {
  const setA = GSet.empty<string>();
  const setB = GSet.empty<string>();

  setA.add(helloJavaScript);
  setB.add(helloRust);

  setA.merge(setB);
  setB.merge(setA);
  assertArrayIncludes([...setA.value], [helloRust, helloJavaScript]);
  assertArrayIncludes([...setB.value], [helloRust, helloJavaScript]);
});
