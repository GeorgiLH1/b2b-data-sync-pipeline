import { app } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig(process.env);

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT} (${config.NODE_ENV})`);
});
