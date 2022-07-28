import { nanoid } from "./deps.ts";
import { ReplicaId } from "./ReplicaId.ts";
import { VTime } from "./VTime.ts";
import { VTimeOrd } from "./VTimeOrd.ts";

export class ORSet<T> {
  public added: Map<T, VTime> = new Map<T, VTime>();
  public removed: Map<T, VTime> = new Map<T, VTime>();
  public replicaId: ReplicaId;

  constructor(replicaId?: ReplicaId) {
    this.replicaId = replicaId ?? nanoid();
  }

  static empty<T>(): ORSet<T> {
    return new ORSet<T>();
  }

  get value() {
    return [...this.removed.entries()].reduce(
      (acc, [removedValue, removedTime]) => {
        const addedTime = this.added.get(removedValue);
        if (
          typeof addedTime !== "undefined" &&
          addedTime.compare(removedTime) === VTimeOrd.Lt
        ) {
          // 正常情况下，执行 remove 和 merge 都会对 added 和 removed 进行修剪，似乎不太可能触发这里的情况。
          acc.delete(removedValue);
        }
        return acc;
      },
      new Set(this.added.keys()),
    );
  }

  add(value: T) {
    const addedTime = this.added.get(value);
    const removedTime = this.removed.get(value);
    const foundTime = addedTime ?? removedTime;
    if (typeof foundTime !== "undefined") {
      this.added.set(value, foundTime.inc());
      this.removed.delete(value);
    } else {
      this.added.set(value, new VTime(this.replicaId).inc());
    }
    return this;
  }

  remove(value: T) {
    const addedTime = this.added.get(value);
    const removedTime = this.removed.get(value);
    const foundTime = addedTime ?? removedTime;
    if (typeof foundTime !== "undefined") {
      this.removed.set(value, foundTime.inc());
      this.added.delete(value);
    } else {
      this.removed.set(value, new VTime(this.replicaId).inc());
    }
    return this;
  }

  merge(other: ORSet<T>): ORSet<T> {
    const mergeKeys = (target: Map<T, VTime>, source: Map<T, VTime>) => {
      for (const [sValue, sTime] of source) {
        const tTime = target.get(sValue);
        if (typeof tTime === "undefined") {
          target.set(sValue, new VTime(this.replicaId).merge(sTime));
        } else {
          target.set(sValue, tTime.merge(sTime));
        }
      }
    };
    const removeDeletedKeys = (
      target: Map<T, VTime>,
      source: Map<T, VTime>,
    ) => {
      for (const [sValue, sTime] of source) {
        const tTime = target.get(sValue);
        if (typeof tTime !== "undefined") {
          if (tTime.compare(sTime) === VTimeOrd.Lt) {
            target.delete(sValue);
          }
        }
      }
    };

    mergeKeys(this.added, other.added);
    mergeKeys(this.removed, other.removed);

    removeDeletedKeys(this.added, this.removed);
    removeDeletedKeys(this.removed, this.added);

    return this;
  }
}
