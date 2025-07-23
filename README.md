# Real-Time Collaborative Code Editor

##  Project Overview

This is a full-stack, real-time collaborative code editor application inspired by tools like Google Docs and CodePen, allowing multiple users to edit code simultaneously within shared sessions. Changes made by any user are instantly reflected for all other collaborators, fostering seamless team coding and pair programming experiences.

##  Live Demo

Experience the editor live!
[https://dev-collab-sigma.vercel.app/](https://dev-collab-sigma.vercel.app/)
*(Note: The backend service might take a few seconds to "wake up" due to free-tier hosting limitations.)*

## Key Features

* **Real-Time Synchronization:** Instant propagation of code changes across all connected clients in a session.
* **Monaco Editor Integration:** Utilizes the powerful code editor that powers VS Code, offering:
    * Syntax Highlighting
    * Indentation
    * Code Completion (basic)
    * Multiple Themes (`vs-dark`, `light`, `hc-black`)
    * Language Selection (JavaScript, Python, HTML, CSS, etc.)
* **Dynamic Room Management:** Users can create new unique rooms or join existing ones using a shared Room ID.
* **Persistent Documents:** All code content, language, and theme settings are saved to a MongoDB Atlas database, ensuring data persists even if the server restarts.
* **User Presence:** Basic notifications for users joining or leaving a room.

## 💻 Technologies Used

This project leverages a modern full-stack architecture to deliver a robust real-time experience.

**Frontend:**
* **React.js:** A declarative, component-based JavaScript library for building interactive user interfaces.
* **`@monaco-editor/react`:** A convenient React wrapper for the Monaco Editor.
* **`socket.io-client`:** The client-side library for establishing real-time WebSocket connections.

**Backend:**
* **Node.js:** A JavaScript runtime environment for building scalable server-side applications.
* **Express.js:** A fast, minimalist web framework for Node.js.
* **`socket.io`:** Enables efficient, bidirectional, event-based real-time communication.
* **`mongoose`:** An Object Data Modeling (ODM) library for MongoDB and Node.js, simplifying database interactions.
* **`dotenv`:** For secure management of environment variables.
* **`uuid`:** For generating unique room identifiers.
* **`cors`:** Middleware to handle Cross-Origin Resource Sharing.

**Database:**
* **MongoDB Atlas:** A cloud-hosted NoSQL document database (using its free M0 tier) for persistent storage of collaborative documents.

**Deployment:**
* **Vercel (Frontend):** For continuous deployment and hosting of the React application.
* **Render (Backend):** For hosting the Node.js server with WebSocket support.

## ⚙️ How to Run Locally

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
* Node.js (LTS version recommended)
* npm (comes with Node.js)
* A free MongoDB Atlas account (for database setup)

**1. Clone the repository:**

```bash
git clone [https://github.com/your-username/collaborative-code-editor.git](https://github.com/your-username/collaborative-code-editor.git)
cd collaborative-code-editor
```

