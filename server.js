const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

// Helper: read JSON
function readData() {
    return JSON.parse(fs.readFileSync("EKSdetUseCase.json"));
}

// Helper: write JSON
function writeData(data) {
    fs.writeFileSync("EKSdetUseCase.json", JSON.stringify(data, null, 2));
}

// ----------------------
// READ
// ----------------------

// Get all apps
app.get("/api/apps", (req, res) => {
    const data = readData();
    res.json(data);
});

// Search apps by query params
app.get("/api/apps/search", (req, res) => {
    const { appName, appOwner, appPath } = req.query;
    let data = readData();

    if (appName) {
        data = data.filter(item =>
            item.appName.toLowerCase().includes(appName.toLowerCase())
        );
    }
    if (appOwner) {
        data = data.filter(item =>
            item.appData.appOwner.toLowerCase().includes(appOwner.toLowerCase())
        );
    }
    if (appPath) {
        data = data.filter(item =>
            item.appData.appPath.toLowerCase().includes(appPath.toLowerCase())
        );
    }

    res.json(data);
});

// Get single app by index
app.get("/api/apps/:index", (req, res) => {
    const data = readData();
    const index = parseInt(req.params.index);
    if (index >= 0 && index < data.length) {
        res.json(data[index]);
    } else {
        res.status(404).json({ message: "Index not found" });
    }
});

// ----------------------
// CREATE
// ----------------------
app.post("/api/apps", (req, res) => {
    const newApp = req.body;

    if (!newApp.appName || !newApp.appData || !newApp.appData.appOwner || !newApp.appData.appPath) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const data = readData();
    data.push(newApp);
    writeData(data);

    res.status(201).json({ message: "App added successfully", app: newApp });
});

// ----------------------
// UPDATE
// ----------------------
app.put("/api/apps/:index", (req, res) => {
    const data = readData();
    const index = parseInt(req.params.index);

    if (index >= 0 && index < data.length) {
        const updatedApp = req.body;

        // Basic validation
        if (!updatedApp.appName || !updatedApp.appData || !updatedApp.appData.appOwner || !updatedApp.appData.appPath) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        data[index] = updatedApp;
        writeData(data);

        res.json({ message: "App updated successfully", app: updatedApp });
    } else {
        res.status(404).json({ message: "Index not found" });
    }
});

// ----------------------
// DELETE
// ----------------------
app.delete("/api/apps/:index", (req, res) => {
    const data = readData();
    const index = parseInt(req.params.index);

    if (index >= 0 && index < data.length) {
        const deletedApp = data.splice(index, 1)[0];
        writeData(data);
        res.json({ message: "App deleted successfully", app: deletedApp });
    } else {
        res.status(404).json({ message: "Index not found" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
});
