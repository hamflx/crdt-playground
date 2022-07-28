import { nanoid } from "./deps.ts";
import { ReplicaId } from "./ReplicaId.ts";

export class GCounter {
  public map: Map<ReplicaId, number> = new Map();
  public replicaId: ReplicaId;

  constructor(replicaId?: ReplicaId) {
    this.replicaId = replicaId ?? nanoid();
  }

  static get zero() {
    return new GCounter(nanoid());
  }

  get value() {
    let sum = 0;
    for (const [_, value] of this.map) {
      sum += value;
    }
    return sum;
  }

  inc(): GCounter {
    const value = this.map.get(this.replicaId) ?? 0;
    this.map.set(this.replicaId, value + 1);
    return this;
  }

  merge(other: GCounter): GCounter {
    for (const [otherReplicaId, otherValue] of other.map) {
      const localValue = this.map.get(otherReplicaId);
      if (typeof localValue === "number") {
        const mergedValue = Math.max(localValue, otherValue);
        if (mergedValue !== localValue) {
          this.map.set(otherReplicaId, mergedValue);
        }
      } else {
        this.map.set(otherReplicaId, otherValue);
      }
    }
    return this;
  }
}
