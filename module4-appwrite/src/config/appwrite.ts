import dotenv from "dotenv";
dotenv.config();

import { Client, Databases, Storage } from "node-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const storage = new Storage(client);

export { client, databases, storage };
