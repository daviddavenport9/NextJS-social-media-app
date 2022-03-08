import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  //   const client = await MongoClient.connect(
  //     "mongodb+srv://David:Y4L0lyp7JFPkJZsZ@cluster0.caovy.mongodb.net/social-media-app?retryWrites=true&w=majority"
  //   );

  const client = await MongoClient.connect(
    "mongodb://David:Y4L0lyp7JFPkJZsZ@cluster0-shard-00-00.caovy.mongodb.net:27017,cluster0-shard-00-01.caovy.mongodb.net:27017,cluster0-shard-00-02.caovy.mongodb.net:27017/social-media-app?ssl=true&replicaSet=atlas-a57h9l-shard-0&authSource=admin&retryWrites=true&w=majority"
  );

  return client;
}
