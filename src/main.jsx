import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EmojiCurator from './components/EmojiCurator.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/emoji" element={<EmojiCurator />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </ErrorBoundary>
  </StrictMode>,
)



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Safety: Remove static splash screen after 3s if App hasn't done it (e.g. error)
setTimeout(() => {
  const staticSplash = document.getElementById('static-splash');
  if (staticSplash) {
    console.warn("Forcing splash screen removal (safety timeout)");
    staticSplash.style.opacity = '0';
    staticSplash.style.transition = 'opacity 0.5s ease';
    setTimeout(() => staticSplash.remove(), 500);
  }
}, 3000);
