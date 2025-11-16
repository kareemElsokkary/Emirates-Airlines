let jsonData = [];

// Load JSON data from data.json
async function loadData() {
  try {
    const response = await fetch("data.json");
    jsonData = await response.json();
    renderTable();
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

const tableBody = document.querySelector("#dataTable tbody");

function renderTable(data = jsonData) {
  tableBody.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="text" value="${item.appName}" id="appName_${index}" readonly></td>
      <td><input type="text" value="${item.appData.appPath}" id="appPath_${index}" readonly></td>
      <td><input type="text" value="${item.appData.appOwner}" id="owner_${index}"></td>
      <td>
        <select id="isValid_${index}">
          <option value="true" ${item.appData.isValid ? "selected" : ""}>True</option>
          <option value="false" ${!item.appData.isValid ? "selected" : ""}>False</option>
        </select>
      </td>
      <td>
        <button class="edit-btn" onclick="updateRecord(${index})">Update</button>
        <button class="delete-btn" onclick="deleteRecord(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updateRecord(index) {
  const owner = document.getElementById(`owner_${index}`).value;
  const isValid = document.getElementById(`isValid_${index}`).value === "true";

  jsonData[index].appData.appOwner = owner;
  jsonData[index].appData.isValid = isValid;

  renderTable();
}

function deleteRecord(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    jsonData.splice(index, 1);
    renderTable();
  }
}

function addRecord() {
  const appName = document.getElementById("appNameInput").value;
  const appPath = document.getElementById("appPathInput").value;
  const owner = document.getElementById("ownerInput").value;
  const isValid = document.getElementById("isValidInput").value === "true";

  if (!appName || !appPath || !owner) {
    alert("App Name, App Path, and Owner cannot be empty");
    return;
  }

  jsonData.push({
    appName,
    appData: {
      appPath,
      appOwner: owner,
      isValid
    }
  });
  renderTable();

  document.getElementById("appNameInput").value = "";
  document.getElementById("appPathInput").value = "";
  document.getElementById("ownerInput").value = "";
}

function searchData() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = jsonData.filter(item =>
    item.appData.appOwner.toLowerCase().includes(query) ||
    item.appName.toLowerCase().includes(query)
  );
  renderTable(filtered);
}

function resetTable() {
  document.getElementById("searchInput").value = "";
  renderTable();
}

// --------------------
// Simulated API Gateway
// --------------------
function callApi() {
  const method = document.getElementById("apiMethod").value;
  const query = document.getElementById("apiQuery").value;
  const bodyText = document.getElementById("apiBody").value;
  let response = { status: 200, message: "", data: null };

  try {
    switch(method) {
      case "GET":
        if (!query) {
          response.data = jsonData;
          response.message = "All records retrieved";
        } else {
          const filtered = jsonData.filter(item =>
            item.appData.appOwner.toLowerCase().includes(query.toLowerCase())
          );
          response.data = filtered;
          response.message = filtered.length ? "Filtered records retrieved" : "No records found";
        }
        break;

      case "POST":
        if (!bodyText) throw new Error("Body required for POST");
        const newObj = JSON.parse(bodyText);
        if (!newObj.appName || !newObj.appData || !newObj.appData.appPath || !newObj.appData.appOwner) {
          throw new Error("Invalid JSON structure");
        }
        jsonData.push(newObj);
        renderTable();
        response.message = "Record added successfully";
        response.data = newObj;
        break;

      case "PUT":
        if (!query) throw new Error("Index required for PUT");
        const index = parseInt(query);
        if (isNaN(index) || index < 0 || index >= jsonData.length) throw new Error("Invalid index");
        if (!bodyText) throw new Error("Body required for PUT");
        const updatedObj = JSON.parse(bodyText);
        if (!updatedObj.appData) throw new Error("Invalid JSON structure");
        // Keep appName and appPath unchanged
        jsonData[index].appData = updatedObj.appData;
        if (updatedObj.appName) jsonData[index].appName = updatedObj.appName; // optional
        renderTable();
        response.message = "Record updated successfully";
        response.data = jsonData[index];
        break;

      case "DELETE":
        if (!query) throw new Error("Owner required for DELETE");
        const initialLength = jsonData.length;
        jsonData = jsonData.filter(item => !item.appData.appOwner.toLowerCase().includes(query.toLowerCase()));
        const deletedCount = initialLength - jsonData.length;
        renderTable();
        response.message = deletedCount ? `${deletedCount} record(s) deleted` : "No records found to delete";
        response.data = null;
        break;

      default:
        response.status = 400;
        response.message = "Invalid method";
    }
  } catch (error) {
    response.status = 400;
    response.message = error.message;
  }

  document.getElementById("apiResult").textContent = JSON.stringify(response, null, 2);
}

// Initial load
loadData();
