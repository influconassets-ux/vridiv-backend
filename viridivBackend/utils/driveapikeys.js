import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Google service-account credentials.
// Production (Render): set GOOGLE_SERVICE_ACCOUNT_JSON to the full contents of the key JSON file.
// Local dev: falls back to utils/apikeys.json (gitignored).
function loadApiKeys() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const keys = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    if (keys.private_key) keys.private_key = keys.private_key.replace(/\\n/g, "\n");
    return keys;
  }

  const localFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "apikeys.json");
  if (fs.existsSync(localFile)) {
    return JSON.parse(fs.readFileSync(localFile, "utf8"));
  }

  console.warn(
    "Google Drive credentials missing: set GOOGLE_SERVICE_ACCOUNT_JSON or add utils/apikeys.json"
  );
  return {};
}

const apikeys = loadApiKeys();

export default apikeys;
