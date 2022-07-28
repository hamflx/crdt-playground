import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { PNCounter } from "./PNCounter.ts";

Deno.test("PNCounter basic", () => {
  const counter = PNCounter.zero;
  counter.inc();

  assertEquals(counter.value, 1);

  counter.inc();
  assertEquals(counter.value, 2);

  counter.dec();
  assertEquals(counter.value, 1);

  counter.dec();
  assertEquals(counter.value, 0);

  counter.dec();
  assertEquals(counter.value, -1);

  const counterWithDefaultId = new PNCounter();
  assertExists(counterWithDefaultId, "每一份副本都需要一个 Id");
});

Deno.test("PNCounter merge", () => {
  const counterA = PNCounter.zero;
  const counterB = PNCounter.zero;
  const counterC = PNCounter.zero;
  counterA.inc();

  counterB.inc();
  counterC.inc();

  counterA.merge(counterB);
  counterA.merge(counterC);
  assertEquals(counterA.value, 3);
  assertEquals(counterB.value, 1);

  counterB.merge(counterA).merge(counterC);
  counterC.merge(counterA).merge(counterB);
  counterC.merge(counterA).merge(counterB);
  assertEquals(counterB.value, 3);
  assertEquals(counterC.value, 3);

  counterB.dec();
  counterC.dec().dec().dec();
  counterA.merge(counterB).merge(counterC);
  assertEquals(counterA.value, -1);
});
