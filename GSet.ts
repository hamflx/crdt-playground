import { nanoid } from "./deps.ts";
import { ReplicaId } from "./ReplicaId.ts";

export class GSet<T> {
  public innerSet: Set<T>;
  public replicaId: ReplicaId;

  constructor(replicaId?: ReplicaId) {
    this.replicaId = replicaId ?? nanoid();
    this.innerSet = new Set();
  }

  static empty<T>(): GSet<T> {
    return new GSet<T>();
  }

  get value() {
    return this.innerSet;
  }

  add(value: T) {
    this.innerSet.add(value);
    return this;
  }

  merge(other: GSet<T>): GSet<T> {
    for (const value of other.innerSet) {
      this.innerSet.add(value);
    }
    return this;
  }
}
