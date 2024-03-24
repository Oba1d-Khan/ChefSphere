import mongoose from "mongoose";

//? DB CONNECTION
export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!); // connect kia
    const connection = mongoose.connection; // connection save kia

    connection.on("connection", () => {
      //    on() method listens to specific events
      console.log("Database successfully connected!");
    });

    connection.on("error", (err) => {
      console.log("Database connection Failed!", err);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}