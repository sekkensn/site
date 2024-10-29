// SketchComponent.js
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const SketchComponent = ({ animationState, onAnimationEnd }) => {
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const animationPausedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let cities = [];
      let distances = [];
      let cityCoords = {};
      let linesToDraw = [];
      let index = 0;
      let minLat, maxLat, minLon, maxLon;
      let currentDistance = 0;
      let totalDistance = 0;
      let framesForAnimation = 30;
      let currentFrame = 0;
      let customFont;

      const sketch = (p) => {
        p.preload = () => {
          try {
            p.loadStrings('/files/default_cities.txt', parseCities);
            p.loadStrings('/files/cities_distances.txt', parseDistances);
            customFont = p.loadFont('/fonts/Nacelle-SemiBold.otf'); // Ensure this path is correct
          } catch (error) {
            console.error('Error loading resources:', error);
          }
        };

        p.setup = () => {
          const canvas = p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
          canvas.parent(canvasRef.current);
          p.frameRate(60);
          if (customFont) {
            p.textFont(customFont); // Set the custom font if loaded
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
        };

        p.draw = () => {
          p.clear(); // Clear the canvas with transparency
          drawCities(p);

          if (animationState === 'running' && !animationPausedRef.current) {
            animateLines(p);
          }

          drawLines(p);
          displayInfo(p);
        };

        const parseCities = (data) => {
          for (let line of data) {
            let [city, lat, lon] = line.split(',').map(s => s.trim());
            cityCoords[city] = { lat: parseFloat(lat), lon: parseFloat(lon) };
          }
          minLat = Math.min(...Object.values(cityCoords).map(c => c.lat));
          maxLat = Math.max(...Object.values(cityCoords).map(c => c.lat));
          minLon = Math.min(...Object.values(cityCoords).map(c => c.lon));
          maxLon = Math.max(...Object.values(cityCoords).map(c => c.lon));
        };

        const parseDistances = (data) => {
          distances = data.map(line => line.split(',').map(s => s.trim()));
        };

        const drawCities = (p) => {
          for (let city in cityCoords) {
            let { lat, lon } = cityCoords[city];
            let x = p.map(lon, minLon, maxLon, p.width / 6, p.width * 5 / 6);
            let y = p.map(lat, maxLat, minLat, p.height / 6, p.height * 5 / 6);
            p.fill(0);
            p.ellipse(x, y, 4, 4);
          }
        };

        const animateLines = (p) => {
          if (index < distances.length) {
            if (currentFrame < framesForAnimation) {
              currentFrame++;
            } else {
              drawNextLine(p);
              currentFrame = 0;
            }
          } else {
            onAnimationEnd();
          }
        };

        const drawNextLine = (p) => {
          if (index < distances.length) {
            let [from, to] = distances[index];
            currentDistance = drawLineWithDistance(p, from, to);
            totalDistance += currentDistance;
            index++;
          }
        };

        const drawLineWithDistance = (p, from, to) => {
          let fromCoords = cityCoords[from];
          let toCoords = cityCoords[to];

          if (!fromCoords || !toCoords) {
            console.error(`Coordinates not found for: from = ${from}, to = ${to}`);
            return 0;
          }

          let x1 = p.map(fromCoords.lon, minLon, maxLon, p.width / 6, p.width * 5 / 6);
          let y1 = p.map(fromCoords.lat, maxLat, minLat, p.height / 6, p.height * 5 / 6);
          let x2 = p.map(toCoords.lon, minLon, maxLon, p.width / 6, p.width * 5 / 6);
          let y2 = p.map(toCoords.lat, maxLat, minLat, p.height / 6, p.height * 5 / 6);
          linesToDraw.push({ x1, y1, x2, y2 });
          return haversineDistance(p, fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
        };

        const drawLines = (p) => {
          p.stroke(255, 0, 0);
          for (let i = 0; i < linesToDraw.length; i++) {
            let line = linesToDraw[i];
            if (i === linesToDraw.length - 1 && currentFrame < framesForAnimation) {
              let progress = currentFrame / framesForAnimation;
              let x2 = p.lerp(line.x1, line.x2, progress);
              let y2 = p.lerp(line.y1, line.y2, progress);
              p.line(line.x1, line.y1, x2, y2);
            } else {
              p.line(line.x1, line.y1, line.x2, line.y2);
            }
          }
        };

        const displayInfo = (p) => {
          p.textAlign(p.CENTER);
          p.textSize(25);
          p.fill(255); // Set text color to white
          if (customFont) {
            p.textFont(customFont); // Use the custom font if loaded
          }
          p.text(`Distance: ${currentDistance.toFixed(2)} km`, p.width / 2, 50);
          p.text(`Total Distance: ${totalDistance.toFixed(2)} km`, p.width / 2, 80);
        };

        const haversineDistance = (p, lat1, lon1, lat2, lon2) => {
          const R = 6371;
          const dLat = p.radians(lat2 - lat1);
          const dLon = p.radians(lon1 - lon2);
          const a = p.sin(dLat / 2) * p.sin(dLat / 2) +
            p.cos(p.radians(lat1)) * p.cos(p.radians(lat2)) *
            p.sin(dLon / 2) * p.sin(dLon / 2);
          const c = 2 * p.atan2(p.sqrt(a), p.sqrt(1 - a));
          return R * c;
        };
      };

      p5InstanceRef.current = new p5(sketch, canvasRef.current);

      return () => {
        if (p5InstanceRef.current) {
          p5InstanceRef.current.remove();
        }
      };
    }
  }, []);

  useEffect(() => {
    animationPausedRef.current = animationState === 'paused';
  }, [animationState]);

  return <div ref={canvasRef} className="w-full h-full" />;
};

export default SketchComponent;