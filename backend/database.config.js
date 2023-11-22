// database.config.js
import { connect } from "mongoose";
import "dotenv/config";

export function dbConnect() {
  console.log("Connecting to MongoDB:", process.env.MONGO_URI);

  connect(process.env.MONGO_URI, {}).then(
    () => console.log("Connected to MongoDB"),
    (error) => console.error("Error connecting to MongoDB:", error)
  );
}
