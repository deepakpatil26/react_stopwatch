import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // ✅ Ensure it's "./App" (without .js extension)

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
