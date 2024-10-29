// Sketch.js
import dynamic from 'next/dynamic';
import React from 'react';

const SketchComponent = dynamic(() => import('./SketchComponent'), { ssr: false });

const Sketch = (props) => {
  return <SketchComponent {...props} />;
};

export default Sketch;