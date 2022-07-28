import { nanoid } from "./deps.ts";
import { GCounter } from "./GCounter.ts";
import { ReplicaId } from "./ReplicaId.ts";

export class PNCounter {
  private add: GCounter;
  private del: GCounter;
  private replicaId: ReplicaId;

  constructor(replicaId?: ReplicaId) {
    this.replicaId = replicaId ?? nanoid();
    this.add = new GCounter(this.replicaId);
    this.del = new GCounter(this.replicaId);
  }

  static get zero() {
    return new PNCounter(nanoid());
  }

  get value() {
    return this.add.value - this.del.value;
  }

  inc(): PNCounter {
    this.add.inc();
    return this;
  }

  dec(): PNCounter {
    this.del.inc();
    return this;
  }

  merge(other: PNCounter): PNCounter {
    this.add.merge(other.add);
    this.del.merge(other.del);
    return this;
  }
}
