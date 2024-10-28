"use client";

import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Sketch from './Sketch';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c91670',
    },
    secondary: {
      main: '#757575', // Grey color for the button when animation is running
    },
  },
});

export default function HeroHome() {
  const [animationState, setAnimationState] = useState('start');
  const [key, setKey] = useState(0);

  const handleButtonClick = () => {
    if (animationState === 'start' || animationState === 'restart') {
      setAnimationState('running');
      setKey(prevKey => prevKey + 1);
    } else if (animationState === 'running') {
      setAnimationState('paused');
    } else if (animationState === 'paused') {
      setAnimationState('running');
    }
  };

  const handleAnimationEnd = () => {
    setAnimationState('restart');
  };

  return (
    <ThemeProvider theme={theme}>
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Hero content */}
          <div className="py-12 md:py-20">
            {/* Section header */}
            <div className="pb-12 text-center md:pb-20">
              <h1
                className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
                data-aos="fade-up"
              >
                My Programming Projects
              </h1>
              <div className="mx-auto max-w-3xl">
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-semibold">Audio Moshing</h3>
              <a
                href="https://github.com/sekkensn/Audio-Moshing"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Link
              </a>
              <br />
              <br />
              <h3 className="text-2xl font-semibold">Image Moshing</h3>
              <a
                href="https://github.com/sekkensn/Image-Randomizer"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Link
              </a>
              <br />
              <br />
              <h3 className="text-2xl font-semibold">Pokémon Data Visualization</h3>
              <a
                href="https://sekkensn.github.io/pandamon/"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Page Link
              </a>
              <br />
              <br />
              <h3 className="text-2xl font-semibold">Travelling Salesman Problem</h3>
              <a
                href="https://github.com/sekkensn/TSP-Rust-Implementation"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Link
              </a>
              <br />
              <br />
            </div>
            <div className="text-center mt-4">
              <Button
                variant="contained"
                color={animationState === 'running' ? 'secondary' : 'primary'}
                onClick={handleButtonClick}
              >
                {animationState === 'start' && 'Start Animation'}
                {animationState === 'running' && 'Pause Animation'}
                {animationState === 'paused' && 'Continue Animation'}
                {animationState === 'restart' && 'Restart Animation'}
              </Button>
            </div>
            <div className="flex justify-center items-center h-screen">
              <Sketch key={key} animationState={animationState} onAnimationEnd={handleAnimationEnd} />
            </div>
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
}