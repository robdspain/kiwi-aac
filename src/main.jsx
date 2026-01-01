import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EmojiCurator from './components/EmojiCurator.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmojiCurator />
  </StrictMode>,
)
