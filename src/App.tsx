import React from 'react';
import Platforms from './components/Platforms';
import './styles/platforms.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
      }}>
        <Platforms />
      </div>
    </div>
  );
};

export default App;

