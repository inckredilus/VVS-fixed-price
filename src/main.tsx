// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'

// Import your global CSS
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/markdown.css";

// If you still need index.css for any legacy rules, import it here after your variables
// import "./index.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
