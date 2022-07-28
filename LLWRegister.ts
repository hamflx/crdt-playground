import { nanoid } from "./deps.ts";
import { ReplicaId } from "./ReplicaId.ts";

export class LLWRegister<T> {
  public innerValue?: T;
  public timestamp: number;
  public replicaId: ReplicaId;

  constructor(replicaId?: ReplicaId, value?: T) {
    this.replicaId = replicaId ?? nanoid();
    this.innerValue = value;
    this.timestamp = 0;
  }

  static empty<T>(): LLWRegister<T> {
    return new LLWRegister<T>();
  }

  get value() {
    return this.innerValue;
  }

  set(value: T, ts: number) {
    if (ts > this.timestamp) {
      this.timestamp = ts;
      this.innerValue = value;
    }
    return this;
  }

  merge(other: LLWRegister<T>): LLWRegister<T> {
    if (this.timestamp < other.timestamp) {
      this.timestamp = other.timestamp;
      this.innerValue = other.innerValue;
    }
    return this;
  }
}
