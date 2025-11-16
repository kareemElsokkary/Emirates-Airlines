const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // allow front-end access

// Helper: Read JSON file
function readData() {
  return JSON.parse(fs.readFileSync("data.json"));
}

// Helper: Write JSON file
function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

/* =====================================================
   GET  /api/apps      → Retrieve all data
   ===================================================== */
app.get("/api/apps", (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

/* =====================================================
   POST /api/apps      → Create new record
   ===================================================== */
app.post("/api/apps", (req, res) => {
  const newRecord = req.body;

  if (!newRecord.appName || !newRecord.appData) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  const data = readData();
  data.push(newRecord);
  writeData(data);

  res.status(201).json({ message: "Record created", record: newRecord });
});

/* =====================================================
   PUT /api/apps/:index → Update record
   ===================================================== */
app.put("/api/apps/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const updatedRecord = req.body;

  const data = readData();

  if (index < 0 || index >= data.length) {
    return res.status(404).json({ message: "Record not found" });
  }

  // Prevent modification of fixed fields
  updatedRecord.appName = data[index].appName;
  updatedRecord.appData.appPath = data[index].appData.appPath;

  data[index] = updatedRecord;
  writeData(data);

  res.status(200).json({ message: "Record updated", record: updatedRecord });
});

/* =====================================================
   DELETE /api/apps/:index → Delete record
   ===================================================== */
app.delete("/api/apps/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const data = readData();

  if (index < 0 || index >= data.length) {
    return res.status(404).json({ message: "Record not found" });
  }

  const removed = data.splice(index, 1);
  writeData(data);

  res.status(200).json({ message: "Record deleted", deleted: removed });
});

/* =====================================================
   START SERVER
   ===================================================== */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
