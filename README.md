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
git clone [https://github.com/RaghavAror/DevCollab.git](https://github.com/RaghavAror/DevCollab.git)
cd collaborative-code-editor
```

**2. Backend Setup:**

```bash
cd backend
npm install
touch .env
```

Note:- Add MONGO_URI to the .env file like this:
MONGO_URI=your_mongodb_atlas_connection_string_here
PORT=5000

**3. Start the backend server**

```bash
node server.js 
```

The backend server will run on http://localhost:5000 usually.

**4. Frontend Setup:**
Open a new terminal window and navigate to the frontend directory:

```bash
cd ../frontend
npm install
npm start
```

The frontend application will open in your browser, usually at http://localhost:3000.

**5. Collaborate!**
Open http://localhost:3000 in multiple browser tabs or different browsers and enter the copied Room ID to enter with your username, to test the real-time collaboration.

**6. Future Enhancements**

* Operational Transformation (OT) / CRDTs: Implement advanced algorithms like Y.js for robust, conflict-free real-time merging of concurrent edits.
* Cursor Synchronization: Display real-time cursors and selections of other collaborators.
* User Authentication: Implement a secure login/signup system with JWTs.
* Room Listing/Discovery: Allow users to see a list of active rooms.
* Chat Functionality: Add a real-time chat within each collaborative session.
* Version History: Implement a way to track document revisions and revert to previous states.
* Syntax Linting & Formatting: Integrate linting tools for better code quality.
* Scalability: Use a Socket.IO Redis adapter for horizontal scaling of the backend across multiple server instances.















