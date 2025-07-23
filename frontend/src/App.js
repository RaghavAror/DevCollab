// This will be your main application component, handling user input for joining/creating rooms.
import React, { useState } from 'react';
import './App.css'; // For general app styling
import CodeEditor from './components/CodeEditor';

function App() {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [joined, setJoined] = useState(false);

    const handleJoinCreate = () => {
        if (username.trim()) {
            setJoined(true);
        } else {
            alert('Please enter a username.');
        }
    };

    if (joined) {
        return <CodeEditor roomId={roomId.trim() || undefined} username={username.trim()} />;
    }

    return (
        <div className="App">
            <header className="app-header">
                <h1>Collaborative Code Editor</h1>
            </header>
            <div className="join-section">
                <h2>Join or Create a Room</h2>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Enter Room ID (leave blank to create new)"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                </div>
                <button onClick={handleJoinCreate}>
                    {roomId.trim() ? 'Join Room' : 'Create New Room'}
                </button>
            </div>
        </div>
    );
}

export default App;