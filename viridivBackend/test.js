import { google } from "googleapis";
import apikeys from "./utils/driveapikeys.js";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: apikeys.client_email,
    private_key: apikeys.private_key,
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

async function test() {
  const ROOT_FOLDER_ID = "1TkbAk5KDrObPJPAIw4baEnwrrCHOccxm";
  const folderName = "test@example.com";
  try {
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${ROOT_FOLDER_ID}' in parents and trashed=false`,
      fields: "files(id, name)",
    });
    console.log("Response length:", response.data.files.length);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

test();
