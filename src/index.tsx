import React from 'react';
import ReactDOM from 'react-dom/client';
import * as LucideReact from 'lucide-react';
import App from './App';
import './index.css';

// Expose globals for LivePreview iframe environment
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
(window as any).LucideReact = LucideReact;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);