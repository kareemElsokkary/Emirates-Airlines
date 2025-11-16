const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Helper: Read data
function readData() {
  return JSON.parse(fs.readFileSync("data.json"));
}

// Helper: Write data
function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

/* GET all apps */
app.get("/api/apps", (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

/* POST create new app */
app.post("/api/apps", (req, res) => {
  const newRecord = req.body;
  if (!newRecord.appName || !newRecord.appData || !newRecord.appData.appPath || !newRecord.appData.appOwner) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  const data = readData();
  data.push(newRecord);
  writeData(data);
  res.status(201).json({ message: "Record created", record: newRecord });
});

/* PUT update existing app by index */
app.put("/api/apps/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const updatedRecord = req.body;
  const data = readData();

  if (index < 0 || index >= data.length) return res.status(404).json({ message: "Record not found" });

  // Prevent modification of appName and appPath
  updatedRecord.appName = data[index].appName;
  updatedRecord.appData.appPath = data[index].appData.appPath;

  data[index] = updatedRecord;
  writeData(data);

  res.status(200).json({ message: "Record updated", record: updatedRecord });
});

/* DELETE record by index */
app.delete("/api/apps/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();
  if (index < 0 || index >= data.length) return res.status(404).json({ message: "Record not found" });

  const removed = data.splice(index, 1);
  writeData(data);

  res.status(200).json({ message: "Record deleted", deleted: removed });
});

/* Start server */
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
