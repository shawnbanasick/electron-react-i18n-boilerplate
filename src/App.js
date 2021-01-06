import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTranslation } from "react-i18next";



const App = () => {
  const [t] = useTranslation();
  
    return (
      <div className="App">
        <header className="App-header">
          <h1>{t("hello")}!</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  
}

export default App;
