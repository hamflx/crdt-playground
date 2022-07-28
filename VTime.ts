import { nanoid } from "./deps.ts";
import { GCounter } from "./GCounter.ts";
import { ReplicaId } from "./ReplicaId.ts";
import { VTimeOrd } from "./VTimeOrd.ts";

export class VTime {
  protected counter: GCounter;
  protected replicaId: ReplicaId;

  constructor(replicaId?: ReplicaId) {
    this.replicaId = replicaId ?? nanoid();
    this.counter = new GCounter(this.replicaId);
  }

  static get zero() {
    return new VTime(nanoid());
  }

  get value() {
    return this.counter.value;
  }

  inc(): VTime {
    this.counter.inc();
    return this;
  }

  merge(other: VTime): VTime {
    this.counter.merge(other.counter);
    return this;
  }

  compare(other: VTime) {
    const localMap = this.counter.map;
    const otherMap = other.counter.map;
    const keys = [...new Set([...localMap.keys(), ...otherMap.keys()])];
    return keys.reduce(
      (ord, key) => {
        const localValue = localMap.get(key) ?? 0;
        const otherValue = otherMap.get(key) ?? 0;

        if (ord === VTimeOrd.Eq && localValue > otherValue) {
          return VTimeOrd.Gt;
        }

        if (ord === VTimeOrd.Eq && localValue < otherValue) {
          return VTimeOrd.Lt;
        }

        if (
          (ord === VTimeOrd.Lt && localValue > otherValue) ||
          (ord === VTimeOrd.Gt && localValue < otherValue)
        ) {
          return VTimeOrd.Cc;
        }

        return VTimeOrd.Eq;
      },
      VTimeOrd.Eq,
    );
  }
}
