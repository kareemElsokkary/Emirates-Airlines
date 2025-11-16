let data = [];

// Load JSON data from file
async function loadData() {
  try {
    const response = await fetch('data.json');
    data = await response.json();
    renderTable(data);
  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// Render table
function renderTable(arr) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  arr.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <!-- App Name and App Path are fixed, not editable -->
      <td>${item.appName}</td>
      <td>${item.appData.appPath}</td>

      <!-- Owner is editable -->
      <td contenteditable="true">${item.appData.appOwner}</td>

      <!-- isValid is editable via select -->
      <td>
        <select>
          <option value="true" ${item.appData.isValid ? "selected" : ""}>true</option>
          <option value="false" ${!item.appData.isValid ? "selected" : ""}>false</option>
        </select>
      </td>

      <!-- Actions: Update and Delete -->
      <td>
        <button onclick="updateRecord(${index}, this)">Update</button>
        <button onclick="deleteRecord(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Add new record
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
    appName,
    appData: { appPath, appOwner, isValid }
  };

  data.push(newApp);
  renderTable(data);

  // Clear form
  document.getElementById("newAppName").value = "";
  document.getElementById("newAppPath").value = "";
  document.getElementById("newAppOwner").value = "";
  document.getElementById("newAppIsValid").checked = false;

  alert("New record added successfully!");
}

// Update editable fields only (Owner and isValid)
function updateRecord(index, button) {
  const row = button.closest("tr");
  const appOwner = row.cells[2].innerText.trim();                 // editable
  const isValid = row.cells[3].querySelector("select").value === "true"; // editable

  data[index].appData.appOwner = appOwner;
  data[index].appData.isValid = isValid;

  renderTable(data);
  alert("Record updated successfully!");
}

// Delete a record
function deleteRecord(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    data.splice(index, 1);
    renderTable(data);
  }
}

// Search by Owner
function searchData() {
  const owner = document.getElementById("searchOwner").value.toLowerCase();
  const filtered = data.filter(d => d.appData.appOwner.toLowerCase().includes(owner));
  renderTable(filtered);
}

// Reset table
function resetTable() {
  renderTable(data);
}

// Initialize
window.onload = loadData;
