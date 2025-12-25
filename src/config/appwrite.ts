import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  Databases,
  Storage,
  Account,
  Teams
} from "node-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

// Services
const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);
const teams = new Teams(client);

export { client, databases, storage, account, teams };
