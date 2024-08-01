import React, { useState, useEffect } from 'react';
import './App.css';
import Sketch from './components/Sketch';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c91670',
    },
  },
});

export default function App() {
  const [animationState, setAnimationState] = useState('start');
  const [key, setKey] = useState(0);

  const handleRestart = () => {
    if (animationState === 'start' || animationState === 'restart') {
      setAnimationState('running');
      setKey(prevKey => prevKey + 1);
    }
  };

  useEffect(() => {
    const checkAnimationEnd = setInterval(() => {
      if (window.animationEnded) {
        setAnimationState('restart');
        window.animationEnded = false;
      }
    }, 100);

    return () => clearInterval(checkAnimationEnd);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="App-Header">
          <h1>Programming Projects</h1>
          <br></br>
          <br></br>
          <h2><a href="https://www.linkedin.com/in/philipweimann/" className="App-link" target="_blank" rel="noopener noreferrer">
            My LinkedIn
          </a></h2>

          <br></br>
          <br></br>

          <h3>Audio Moshing</h3>


          <a href="https://github.com/sekkensn/Audio-Moshing" className="App-link" target="_blank" rel="noopener noreferrer">
            Project Link
          </a>

          <br></br>
          <br></br>
          <br></br>

          <h3>Image Moshing</h3>

          <a href="https://github.com/sekkensn/Image-Randomizer" className="App-link" target="_blank" rel="noopener noreferrer">
            Project Link
          </a>

          <br></br>
          <br></br>
          <br></br>

          <h3>Travelling Salesman Problem</h3>
          <h4>Nearest Neighbor Implementation</h4>

          <a href="https://github.com/sekkensn/TSP-Rust-Implementation" className="App-link" target="_blank" rel="noopener noreferrer">
            Project Link
          </a>
          <br></br>
          <br></br>
          <br></br>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRestart}
            disabled={animationState === 'running'}
          >
            {animationState === 'start' && 'Start Animation'}
            {animationState === 'running' && 'Running Animation'}
            {animationState === 'restart' && 'Restart Animation'}
          </Button>
        </div>
        <Sketch key={key} startAnimation={animationState === 'running'} />
      </div>
    </ThemeProvider>
  );
}
