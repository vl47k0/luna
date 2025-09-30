import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <BrowserRouter basename="luna">
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
reportWebVitals();
