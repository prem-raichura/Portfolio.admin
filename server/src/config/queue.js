import IORedis
from "ioredis";

export const queueConnection =
  new IORedis(

    process.env.REDIS_URL,

    {
      maxRetriesPerRequest:
        null,
    }
  );


// import IORedis
// from "ioredis";

// export const queueConnection =
//   new IORedis({

//     host:
//       process.env.REDIS_HOST ||
//       "redis",

//     port:
//       process.env.REDIS_PORT ||
//       6379,

//     maxRetriesPerRequest:
//       null,
//   });