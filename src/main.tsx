import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './index.css' // Commented out to ensure no CSS crash for now, or per user generic 'strictly looks like this' (User showed import './index.css', so I'll include it IF it exists. I'll include it.)
// Actually user request:
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode><App /></React.StrictMode>
// )
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)