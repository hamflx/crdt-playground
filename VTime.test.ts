import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { VTime } from "./VTime.ts";
import { VTimeOrd } from "./VTimeOrd.ts";

Deno.test("VTime basic", () => {
  const counterA = VTime.zero;
  const counterB = VTime.zero;
  const counterC = VTime.zero;
  counterA.inc();

  counterB.inc();
  counterC.inc();

  counterA.merge(counterB);
  counterA.merge(counterC);
  assertEquals(counterA.value, 3);
  assertEquals(counterB.value, 1);

  const counterWithDefaultId = new VTime();
  assertExists(counterWithDefaultId, "每一份副本都需要一个 Id");
});

Deno.test("VTime compare", () => {
  const timeA = VTime.zero;
  const timeB = VTime.zero;

  timeA.inc();
  assertEquals(timeA.compare(timeB), VTimeOrd.Gt);
  assertEquals(timeB.compare(timeA), VTimeOrd.Lt);

  timeB.merge(timeA);
  assertEquals(timeA.compare(timeB), VTimeOrd.Eq);
  assertEquals(timeB.compare(timeA), VTimeOrd.Eq);

  timeB.inc();
  assertEquals(timeA.compare(timeB), VTimeOrd.Lt);
  assertEquals(timeB.compare(timeA), VTimeOrd.Gt);

  timeA.inc();
  assertEquals(timeA.compare(timeB), VTimeOrd.Cc);
  assertEquals(timeB.compare(timeA), VTimeOrd.Cc);
});
