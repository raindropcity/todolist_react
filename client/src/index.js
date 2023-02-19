import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 為了串接Github的OAuth，移除strict mode ，因為strict mode會render二次，將造成Github第一次給的token失效
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
