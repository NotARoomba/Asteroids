import * as mongoDB from "mongodb";
import * as dotenv from "ts-dotenv";

const env = dotenv.load({
  MONGODB: String,
  USER_DB_NAME: String,
  USER_COLLECTION: String,
  SALON_DB_NAME: String,
  SALON_COLLECTION: String,
});

export const collections: {
  users?: mongoDB.Collection;
  salones?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(env.MONGODB);
  await client.connect();

  const userDB: mongoDB.Db = client.db(env.USER_DB_NAME);
  const usersCollection: mongoDB.Collection = userDB.collection(
    env.USER_COLLECTION,
  );
  collections.users = usersCollection;

  const salonDB: mongoDB.Db = client.db(env.SALON_DB_NAME);
  const salonsCollection: mongoDB.Collection = salonDB.collection(
    env.SALON_COLLECTION,
  );
  collections.salones = salonsCollection;

  console.log("Successfully connected to database!");
}
