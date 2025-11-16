📘 Emirates JSON Manager – Web Application + API Gateway

This project provides a complete JSON data management system used by teams to store, edit, update, and retrieve application information.
It includes:

✔ A Web Application (HTML + CSS + JavaScript) to view, search, update, delete, and create records
✔ A Node.js REST API Server for external teams to retrieve and update data through API calls
✔ A data.json file acting as a simple database

🚀 Project Overview

Many teams frequently need to access and modify a shared JSON database containing application metadata.
This project solves these needs by providing:

✔ Web App Features

Search records

Update appOwner and isValid

Delete records

Add new records

Display all data in a table

Read-only fields:

appName (cannot be modified)

appPath (cannot be modified)

Web Application send also the ApI request and show its response 
🖥️ How to Run the Web Application

Simply open:

index.html


No server is required for the frontend.

🛠️ How to Run the Backend Server
1. Install Node.js

Download & install: https://nodejs.org

2. Initialize the project

Open PowerShell or CMD inside your project folder:

npm init -y

3. Install required packages
npm install express cors

4. Start the server
node server.js


You should see:

Server running on http://localhost:3000

🌐 API Usage Examples
GET all apps
GET http://localhost:3000/api/apps

POST (Create new record)

Body:

{
  "appName": "New App Name",
  "appData": {
    "appPath": "New App Path",
    "appOwner": "Owner Name",
    "isValid": true
  }
}

PUT (Update index 0)
PUT http://localhost:3000/api/apps/0


Body:

{
  "appName": "IGNORED",
  "appData": {
    "appPath": "IGNORED",
    "appOwner": "Updated Owner",
    "isValid": false
  }
}

DELETE (Delete index 1)
DELETE http://localhost:3000/api/apps/1

created by Kareem Elsokkary
16.11.2025
