import helmet from "helmet";

import cors from "cors";

import compression
from "compression";

import hpp from "hpp";

import morgan from "morgan";

export const securityMiddleware =
  (app) => {

    app.use(
      helmet({
        crossOriginResourcePolicy:
          false,
      })
    );

    app.use(
      cors({

        origin: [
          "http://localhost:3000",
          "http://localhost:5173",
        ],

        credentials: true,
      })
    );

    app.use(
      compression()
    );

    app.use(
      hpp()
    );

    app.use(
      morgan("dev")
    );
  };