import { Queue } from "bullmq";

import {
  queueConnection,
} from "../../config/queue.js";

export const binQueue =
  new Queue(
    "binQueue",
    {
      connection:
        queueConnection,
    }
  );
