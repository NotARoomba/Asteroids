import * as mongoDB from "mongodb";
import * as dotenv from "ts-dotenv";

const env = dotenv.load({
  MONGODB: String,
  SCORE_DB_NAME: String,
  SCORE_COLLECTION: String,
});

export const collections: {
  scores?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(env.MONGODB);
  await client.connect();

  const userDB: mongoDB.Db = client.db(env.SCORE_DB_NAME);
  const usersCollection: mongoDB.Collection = userDB.collection(
    env.SCORE_COLLECTION,
  );
  collections.scores = usersCollection;

  console.log("Successfully connected to database!");
}
