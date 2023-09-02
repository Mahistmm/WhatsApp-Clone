const mongoose = require("mongoose");
const Pusher = require("pusher");

const url =
  "mongodb+srv://Mahi:stmmsara@clusterfsb.opmw8qr.mongodb.net/Whatsapp-clone?retryWrites=true&w=majority";

const pusher = new Pusher({
  appId: "1662775",
  key: "6209a214fa4406f294a2",
  secret: "8c2d57cdc268fe0de8c2",
  cluster: "ap2",
  useTLS: true,
});

const connectDB = async () => {
  try {
    const con = await mongoose.connect(url);
    console.log(`Connected DB ${con.connection.host}`);

    const db = mongoose.connection;

    const messageCollection = db.collection("messages");
    const changeStream = messageCollection.watch();

    changeStream.on("change", (change) => {
      if (change.operationType === "insert") {
        const messageDetails = change.fullDocument;
        pusher.trigger("messages", "inserted", messageDetails);
      } else {
        console.log("Not expected event to trigger");
      }
    });

    const roomCollection = db.collection("rooms");
    const changeStream1 = roomCollection.watch();

    changeStream1.on("change", (change) => {
      if (change.operationType === "insert") {
        const roomDetails = change.fullDocument;
        pusher.trigger("rooms", "inserted", roomDetails);
      } else {
        console.log("Not expected event to trigger");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
