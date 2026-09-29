import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { getSiteData } from './services/siteService';
import './index.css';

const root = createRoot(document.getElementById('root')!);

getSiteData()
  .then((data) =>
    root.render(
      <StrictMode>
        <App data={data} />
      </StrictMode>,
    ),
  )
  .catch((error) => {
    console.error(error);
    root.render(<p style={{ padding: 32, fontFamily: 'sans-serif' }}>Sorry, the website could not be loaded. Please refresh.</p>);
  });
