import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import App from './App';
import { Web3Provider } from './contexts/Web3Context';
import { EnhancedWeb3Provider } from './contexts/EnhancedWeb3Context';
import { ThemeProvider } from './contexts/ThemeContext';

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the app with complete provider structure
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Web3Provider>
          <EnhancedWeb3Provider>
            <App />
          </EnhancedWeb3Provider>
        </Web3Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}
