import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NoPage from './Nopage.js'
import FirebaseContextProvider from './context';
import { BrowserRouter ,Route,Routes} from 'react-router-dom';
import InsideClass from './InsideClass.js'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <FirebaseContextProvider>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App />} />
          <Route path="/classroom/:id" element={<InsideClass/>} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
   </FirebaseContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
