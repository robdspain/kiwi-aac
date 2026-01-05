import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './index.css'
import App from './App.jsx'
import EmojiCurator from './components/EmojiCurator.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { AACProvider } from './context/AAContext.jsx'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialize PWA Elements for Camera/Photos support on web
defineCustomElements(window);

setupIonicReact({
  mode: 'ios' // App strictly defaults to Light Mode for visual stability
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ProfileProvider>
        <AACProvider>
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/" exact={true} component={App} />
                <Route path="/emoji" component={EmojiCurator} />
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
        </AACProvider>
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
    staticSplash.style.opacity = '0';
    staticSplash.style.transition = 'opacity 0.5s ease';
    setTimeout(() => staticSplash.remove(), 500);
  }
}, 3000);
