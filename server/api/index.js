// Vercel serverless entry. Exports the Express app as the function handler.
// On Vercel `app.listen` is skipped (see src/app.js) — Vercel owns the listener.
import app from "../src/app.js";

export default app;
