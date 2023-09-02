const express = require("express");
const app = express();
const DBConnected = require("./db");
const Rooms = require("./models/dbRoom");
const cors = require("cors");
const Messages = require("./models/dbMessage");

app.use(cors());
app.use(express.json());
DBConnected();

app.get("/", (req, res) => {
  res.send("Server is Working ");
});

app.post("/messages/new", async (req, res) => {
  try {
    const message = new Messages(req.body);
    const data = await message.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/group/create", async (req, res) => {
  try {
    const room = new Rooms(req.body);
    const data = await room.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/all/rooms", async (req, res) => {
  try {
    const data = await Rooms.find();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/room/:id", async (req, res) => {
  try {
    const data = await Rooms.find({ _id: req.params.id });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    const data = await Messages.find({ roomId: req.params.id });
    res.status(201).send(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.listen(process.env.PORT || 4000, (req, res) => {
  console.log("Server is up and running");
});
