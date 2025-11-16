let jsonData = [];

// Load data from server
async function loadData() {
  const res = await fetch("http://localhost:3000/api/apps");
  jsonData = await res.json();
  renderTable();
}

const tableBody = document.querySelector("#dataTable tbody");

// Render table
function renderTable(data = jsonData) {
  tableBody.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" value="${item.appName}" readonly></td>
      <td><input type="text" value="${item.appData.appPath}" readonly></td>
      <td><input type="text" value="${item.appData.appOwner}" id="owner_${index}"></td>
      <td>
        <select id="isValid_${index}">
          <option value="true" ${item.appData.isValid ? "selected" : ""}>True</option>
          <option value="false" ${!item.appData.isValid ? "selected" : ""}>False</option>
        </select>
      </td>
      <td>
        <button onclick="updateRecord(${index})">Update</button>
        <button onclick="deleteRecord(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add record
async function addRecord() {
  const appName = document.getElementById("appNameInput").value;
  const appPath = document.getElementById("appPathInput").value;
  const owner = document.getElementById("ownerInput").value;
  const isValid = document.getElementById("isValidInput").value === "true";

  if (!appName || !appPath || !owner) return alert("All fields required");

  const newRecord = { appName, appData: { appPath, appOwner: owner, isValid } };

  const res = await fetch("http://localhost:3000/api/apps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRecord)
  });
  const result = await res.json();
  alert(result.message);
  loadData();
}

// Update record
async function updateRecord(index) {
  const owner = document.getElementById(`owner_${index}`).value;
  const isValid = document.getElementById(`isValid_${index}`).value === "true";

  const updatedRecord = { appName: "", appData: { appOwner: owner, isValid } };

  const res = await fetch(`http://localhost:3000/api/apps/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedRecord)
  });
  const result = await res.json();
  alert(result.message);
  loadData();
}

// Delete record
async function deleteRecord(index) {
  if (!confirm("Delete this record?")) return;

  const res = await fetch(`http://localhost:3000/api/apps/${index}`, { method: "DELETE" });
  const result = await res.json();
  alert(result.message);
  loadData();
}

// Search
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

// API Gateway
async function callApi() {
  const method = document.getElementById("apiMethod").value;
  const query = document.getElementById("apiQuery").value;
  const bodyText = document.getElementById("apiBody").value;
  let url = "http://localhost:3000/api/apps";
  let options = { method };

  try {
    if (method === "PUT" || method === "DELETE") {
      if (!query) return alert("Index required for PUT/DELETE");
      url += `/${query}`;
    }
    if (method === "POST" || method === "PUT") {
      if (!bodyText) return alert("JSON Body required");
      options.body = bodyText;
      options.headers = { "Content-Type": "application/json" };
    }

    const res = await fetch(url, options);
    const result = await res.json();
    document.getElementById("apiResult").textContent = JSON.stringify(result, null, 2);
    loadData();
  } catch (err) {
    document.getElementById("apiResult").textContent = err.message;
  }
}

// Initial load
loadData();
