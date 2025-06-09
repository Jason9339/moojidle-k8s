import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'
import AlertCenter from '@/utils/alert/AlertCenter/AlertCenter'
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
)

createRoot(document.getElementById('alert-root')).render(
    <StrictMode>
        <AlertCenter />
    </StrictMode>
)
