// This component will encapsulate the Monaco Editor and its Socket.IO logic.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';

// Define themes and languages for selection
const editorThemes = ['vs-dark', 'light', 'hc-black'];
const editorLanguages = ['javascript', 'typescript', 'html', 'css', 'json', 'python', 'java', 'csharp', 'cpp', 'go', 'ruby', 'php', 'sql'];
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'
const CodeEditor = ({ roomId, username }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [status, setStatus] = useState('');
    const socketRef = useRef(null); // Use ref to persist socket instance
    const editorRef = useRef(null); // Use ref to persist editor instance

    // Function to handle editor mount
    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor; // Store editor instance
        // You can access monaco instance here if needed: monacoRef.current = monaco;
    }, []);

    // Effect for Socket.IO connection and event handling
    useEffect(() => {
        // Connect to the backend Socket.IO server
        // Use your backend server URL. For local dev, it's usually http://localhost:5000
        socketRef.current = io(BACKEND_URL); // Ensure this matches your backend port

        socketRef.current.on('connect', () => {
            console.log('Connected to server');
            setStatus('Connected to server.');
            // Emit join-room event once connected
            socketRef.current.emit('join-room', { roomId, username });
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err.message);
            setStatus(`Connection error: ${err.message}`);
        });

        socketRef.current.on('load-document', (data) => {
            setCode(data.content);
            setLanguage(data.language);
            setTheme(data.theme);
            setStatus(`Joined room: ${data.roomId}`);
            console.log('Document loaded:', data.content);
        });

        socketRef.current.on('receive-changes', (newCode) => {
            // Only update if the change didn't originate from this client
            // Monaco's onChange already handles local updates, so this is for remote changes.
            if (editorRef.current && editorRef.current.getValue() !== newCode) {
                 // Monaco editor handles diffing and updating efficiently internally.
                // Simply setting the value will make it sync.
                const currentSelection = editorRef.current.getSelection();
                editorRef.current.setValue(newCode);
                // Restore cursor position if possible (simple approach)
                if (currentSelection) {
                    editorRef.current.setSelection(currentSelection);
                    editorRef.current.revealRangeInCenter(currentSelection, 0);
                }
            }
        });

        socketRef.current.on('receive-language-update', (newLanguage) => {
            setLanguage(newLanguage);
            setStatus(`Language changed to: ${newLanguage}`);
        });

        socketRef.current.on('receive-theme-update', (newTheme) => {
            setTheme(newTheme);
            setStatus(`Theme changed to: ${newTheme}`);
        });

        socketRef.current.on('user-joined', (message) => {
            setStatus(message);
        });

        socketRef.current.on('user-left', (message) => {
            setStatus(message);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server');
            setStatus('Disconnected from server.');
        });

        // Clean up socket connection on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log('Socket disconnected on component unmount');
            }
        };
    }, [roomId, username]); // Re-run effect if roomId or username changes

    // Function to handle editor content changes
    const handleEditorChange = (newValue, event) => {
        setCode(newValue);
        if (socketRef.current) {
            // Send the full content for simplicity. For large documents,
            // consider sending diffs or using Operational Transformation (OT) / CRDTs.
            socketRef.current.emit('send-changes', newValue);
        }
    };

    // Function to handle language change
    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        if (socketRef.current) {
            socketRef.current.emit('update-language', newLanguage);
        }
    };

    // Function to handle theme change
    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        if (socketRef.current) {
            socketRef.current.emit('update-theme', newTheme);
        }
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId)
            .then(() => {
                alert('Room ID copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy Room ID: ', err);
            });
    };

    return (
        <div className="editor-container">
            <div className="app-header">
                <h1>Collaborative Code Editor</h1>
                <div className="room-info">
                    <span className="room-id-display">Room ID: {roomId}</span>
                    <button onClick={copyRoomId} className="copy-button">Copy ID</button>
                </div>
            </div>
            <div className="controls">
                <div className="form-group">
                    <label htmlFor="language-select">Language:</label>
                    <select id="language-select" value={language} onChange={handleLanguageChange}>
                        {editorLanguages.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="theme-select">Theme:</label>
                    <select id="theme-select" value={theme} onChange={handleThemeChange}>
                        {editorThemes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>
            <Editor
                height="70vh" // Set a fixed height or use CSS to make it full height
                language={language}
                theme={theme}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    readOnly: false // Set to true if you want read-only mode for some users
                }}
            />
            <div className="status-message">{status}</div>
        </div>
    );
};

export default CodeEditor;