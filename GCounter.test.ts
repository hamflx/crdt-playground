import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.149.0/testing/asserts.ts";
import { GCounter } from "./GCounter.ts";

Deno.test("GCounter basic", () => {
  const counter = GCounter.zero;
  counter.inc();

  assertEquals(counter.value, 1);

  counter.inc();
  assertEquals(counter.value, 2);

  const counterWithDefaultId = new GCounter();
  assertExists(counterWithDefaultId, "每一份副本都需要一个 Id");
});

Deno.test("GCounter merge", () => {
  const counterA = GCounter.zero;
  const counterB = GCounter.zero;
  const counterC = GCounter.zero;

  counterA.inc();
  counterB.inc();
  counterC.inc();
  counterA.merge(counterB).merge(counterC);
  assertEquals(counterA.value, 3);

  counterA.merge(counterB.inc());
  assertEquals(counterA.value, 4);
});
