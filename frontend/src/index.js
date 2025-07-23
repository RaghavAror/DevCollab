import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import './index.css'; // Your main CSS file
import App from './App'; // Your main App component

// If you have reportWebVitals.js (optional, can be skipped for now)
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you have reportWebVitals.js and want to enable performance reporting
// reportWebVitals();