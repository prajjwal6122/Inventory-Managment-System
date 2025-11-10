# 🧮 FIFO Inventory Management System

![View Count](https://komarev.com/ghpvc/?username=PrajjwalSharma&label=Repo%20Views&color=brightgreen)  
🧭 Navigation Instructions

Visit the live site → https://fifo-inventory-managment-system.onrender.com

Login using the credentials shared in the candidate deliverables.

The dashboard auto-connects to Kafka via Socket.io and streams inventory updates in real time.

Developers can run the local Kafka producer to simulate live stock inflow.
---

## 📘 Overview
**FIFO Inventory Management System** is a full-stack web application that demonstrates **real-time stock tracking** and **First-In, First-Out (FIFO)** inventory management using **Kafka, PostgreSQL, React, and Socket.io**.

The system ensures that items added earliest are processed first — a principle essential for accurate warehouse and stock management.

---

## 🏗️ Tech Stack

**Frontend:**
- React.js  
- TailwindCSS  
- Axios  
- Socket.io-client  

**Backend:**
- Node.js  
- Express.js  
- Kafka  
- PostgreSQL  
- Socket.io  

**Other Tools:**
- Render (for deployment)  
- dotenv for environment management  

---

## 🧩 System Architecture

\+--------------------------+\
| Frontend |\
| React + TailwindCSS |
| (WebSocket / API)
| Socket.io-client |\
+-----------+--------------+

| Backend |\
+-----------+--------------+\
| Backend API |
| Express + Socket.io || Kafka Consumer + FIFO |
| PostgreSQL Integration |
\
+-----------+--------------+


| (Kafka Topic) |\
v\
+-----------+--------------+\
| Kafka Producer |\
| producer.js (local sim) |\
+--------------------------+


---

## 📦 Folder Structure



fifo-inventory-management/ \
│── client/ # React frontend \
│ ├── src/  \
│ │ ├── components/ # UI components \
│ │ ├── pages/ # Pages and views \
│ │ ├── services/ # API calls (Axios) \
│ │ └── App.js # Entry point \
│ └── package.json \
│ \
│── server/ # Node.js backend \
│ ├── src/ \
│ │ ├── config/ # DB, Kafka setup \
│ │ ├── controllers/ # FIFO logic & APIs \
│ │ ├── routes/ # Express routes \
│ │ ├── models/ # PostgreSQL models \
│ │ ├── kafka/ # Producer/Consumer setup \
│ │ └── server.js # Entry file \
│ └── package.json \
│\
│── .env.example \
└── README.md \


---

## ⚙️ FIFO Logic Explanation

The **FIFO (First-In, First-Out)** principle ensures that:
> The oldest inventory entries (by entry timestamp) are the first ones deducted when items are sold or processed.

**Implementation Overview:**
- When new stock is produced (via Kafka producer), it’s pushed into the DB with a timestamp.  
- When stock is consumed, the backend fetches the **oldest batch first** and deducts quantities sequentially until the requirement is met.  
- Kafka consumers ensure all stock updates are synchronized in real time across connected clients using Socket.io.

---

## 💾 Environment Setup 

Create a `.env` file in your `server` directory: \


PORT=3000\
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db_name>\
KAFKA_BROKER=localhost:9092\
CLIENT_URL=http://localhost:3001\

🧠 Run Locally\
1️⃣ Clone the repository\
git clone https://github.com/prajjwal6122/fifo-inventory-management.git\
cd fifo-inventory-management\

2️⃣ Setup Backend\
cd server\
npm install\
npm run dev

3️⃣ Setup Frontend\
cd ../client\
npm install\
npm start

🚀 Deployment

The project is deployed on Render
🔗 Live URL: https://fifo-inventory-managment-system.onrender.com

📊 Features Summary
Feature	Description\
⚡ Real-Time Updates	Stock movement and changes visible instantly\
🧮 FIFO Logic	Ensures earliest stock is used first\
🧠 Kafka Integration	Event-driven system for stock updates\
🧱 PostgreSQL	Persistent and structured inventory data\
🧭 Dashboard	Live visualization of stock levels\
🛠️ CRUD APIs	Add, update, delete, and fetch inventory items\
📈 Static Counters\



👨‍💻 Author

Developed by Prajjwal Sharma\
Full Stack Software Engineer | MERN + PostgreSQL + Kafka + React Expert\
© 2025 All Rights Reserved


---
