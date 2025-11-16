let data = [];

// Fetch data from server
async function loadData() {
    const res = await fetch("/api/data");
    data = await res.json();
    displayData();
}

// Display data in table
function displayData(filteredData = data) {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    filteredData.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td contenteditable="true">${item.appName}</td>
            <td contenteditable="true">${item.appData.appPath}</td>
            <td contenteditable="true">${item.appData.appOwner}</td>
            <td><input type="checkbox" ${item.appData.isValid ? "checked" : ""}></td>
            <td>
                <button onclick="updateData(${index}, this)">Update</button>
                <button onclick="deleteData(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Search function
// Search function: by appName, appOwner, or appPath
function searchData() {
    const query = document.getElementById("search").value.toLowerCase();

    const filtered = data.filter(item =>
        item.appName.toLowerCase().includes(query) ||                 // search by appName
        item.appData.appOwner.toLowerCase().includes(query) ||        // search by appOwner
        item.appData.appPath.toLowerCase().includes(query)            // search by appPath
    );

    displayData(filtered);
}
function addNewData() {
    const appName = document.getElementById("newAppName").value.trim();
    const appPath = document.getElementById("newAppPath").value.trim();
    const appOwner = document.getElementById("newAppOwner").value.trim();
    const isValid = document.getElementById("newAppIsValid").checked;

    if (!appName || !appPath || !appOwner) {
        alert("Please fill in all fields!");
        return;
    }

    const newApp = {
        appName: appName,
        appData: {
            appPath: appPath,
            appOwner: appOwner,
            isValid: isValid
        }
    };

    // Add to data array
    data.push(newApp);

    // Refresh table
    displayData();

    // Clear form
    document.getElementById("newAppName").value = "";
    document.getElementById("newAppPath").value = "";
    document.getElementById("newAppOwner").value = "";
    document.getElementById("newAppIsValid").checked = false;

    alert("New app added successfully!");
}


// Update record
async function updateData(index, button) {
    const row = button.closest("tr");
    const updated = {
        appName: row.cells[0].innerText,
        appData: {
            appPath: row.cells[1].innerText,
            appOwner: row.cells[2].innerText,
            isValid: row.cells[3].querySelector("input").checked
        }
    };

    await fetch(`/api/data/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
    });

    loadData();
}

// Delete record
async function deleteData(index) {
    await fetch(`/api/data/${index}`, { method: "DELETE" });
    loadData();
}

// Initialize
loadData();
