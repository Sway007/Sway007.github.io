import { useEffect, useState } from 'react';
import { createOasis } from './demo/plane';
// import { createOasis } from './demo/demoQuat';
import './App.css';

function App() {
  useEffect(() => {
    console.log('effect');
    createOasis();
  }, []);

  return (
    <canvas id='canvas' style={{ width: '100vw', height: '100vh' }}></canvas>
  );
}

export default App;
