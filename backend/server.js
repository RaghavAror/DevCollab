require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'); // Import mongoose

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://dev-collab-sigma.vercel.app/", // CHANGE THIS TO YOUR ACTUAL FRONTEND URL
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- Mongoose Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Document Schema ---
const Document = mongoose.model('Document', new mongoose.Schema({
    _id: String, // Use roomId as _id for easy lookup
    content: {
        type: String,
        default: "// Start coding!"
    },
    language: {
        type: String,
        default: "javascript"
    },
    theme: {
        type: String,
        default: "vs-dark"
    }
}, { timestamps: true })); // Add timestamps for creation/update times

// --- Socket.IO Connection Handling ---
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Event: 'join-room'
    socket.on('join-room', async ({ roomId, username }) => {
        let currentRoomId = roomId;
        let document;

        if (!currentRoomId) {
            // Create a new room if no ID provided
            currentRoomId = uuidv4();
            document = new Document({ _id: currentRoomId });
            await document.save();
            console.log(`New room created and saved to DB: ${currentRoomId}`);
        } else {
            // Find existing document or create if it doesn't exist
            document = await Document.findById(currentRoomId);
            if (!document) {
                document = new Document({ _id: currentRoomId });
                await document.save();
                console.log(`Room ${currentRoomId} initialized and saved to DB.`);
            }
        }

        socket.join(currentRoomId);
        console.log(`${username} (${socket.id}) joined room: ${currentRoomId}`);

        // Send the current document data to the newly joined client
        socket.emit('load-document', {
            content: document.content,
            language: document.language,
            theme: document.theme,
            roomId: currentRoomId
        });

        socket.to(currentRoomId).emit('user-joined', `${username} has joined the room.`);

        // Store user data in socket for easy access later
        socket.data.roomId = currentRoomId;
        socket.data.username = username;
    });

    // Event: 'send-changes'
    socket.on('send-changes', async (delta) => {
        const { roomId } = socket.data;
        if (!roomId) return;

        // Update document content in DB
        await Document.findByIdAndUpdate(roomId, { content: delta });

        // Broadcast these changes to all other clients in the same room
        socket.to(roomId).emit('receive-changes', delta);
    });

    // Event: 'update-language'
    socket.on('update-language', async (language) => {
        const { roomId } = socket.data;
        if (!roomId) return;

        // Update language in DB
        await Document.findByIdAndUpdate(roomId, { language: language });

        socket.to(roomId).emit('receive-language-update', language);
    });

    // Event: 'update-theme'
    socket.on('update-theme', async (theme) => {
        const { roomId } = socket.data;
        if (!roomId) return;

        // Update theme in DB
        await Document.findByIdAndUpdate(roomId, { theme: theme });

        socket.to(roomId).emit('receive-theme-update', theme);
    });

    // Event: 'disconnect'
    socket.on('disconnect', () => {
        const { roomId, username } = socket.data;
        console.log(`User Disconnected: ${socket.id} (Room: ${roomId}, User: ${username})`);
        if (roomId) {
            io.to(roomId).emit('user-left', `${username} has left the room.`);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Socket.IO server running on ws://localhost:${PORT}`);
});
