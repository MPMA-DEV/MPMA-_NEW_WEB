// ============================================
// STATIC IMAGE GRID COMPONENT
// 3x5 grid display with description
// ============================================

import React from 'react';
import './ScrollingImageRows.css';

const ScrollingImageRows = () => {
  // Enhanced sample images with bigger size and better gradients
  const images = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFFM0E4QTtzdG9wLW9wYWNpdHk6MC4xIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNCODJGNjtzdG9wLW9wYWNpdHk6MC4wNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjx0ZXh0IHg9Ijc1IiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjYwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+🚢PC90ZXh0Pgo8L3N2Zz4K',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MSkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzM3NDE1MTtzdG9wLW9wYWNpdHk6MC4xIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzVCQzJGNjtzdG9wLW9wYWNpdHk6MC4wNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjx0ZXh0IHg9Ijc1IiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjYwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+⚓PC90ZXh0Pgo8L3N2Zz4K',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MikifLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Y1OUUwQjtzdG9wLW9wYWNpdHk6MC4xIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzZBNUE1RjtzdG9wLW9wYWNpdHk6MC4wNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjx0ZXh0IHg9Ijc1IiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjYwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+🎓PC90ZXh0Pgo8L3N2Zz4K',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MykiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0VBNTg4OTtzdG9wLW9wYWNpdHk6MC4xIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQ0RjY7c3RvcC1vcGFjaXR5OjAuMDUiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI3NSIgeT0iODUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI2MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuu+PC90ZXh0Pgo8L3N2Zz4K',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50NCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ0IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhCNUNGNjtzdG9wLW9wYWNpdHk6MC4xIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzYwQTVGQTtzdG9wLW9wYWNpdHk6MC4wNSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjx0ZXh0IHg9Ijc1IiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjYwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+⚙️PC90ZXh0Pgo8L3N2Zz4K'
  ];

  // Create 15 images for 3x5 grid
  const createRowImages = () => {
    return Array.from({ length: 15 }, (_, index) => images[index % images.length]);
  };

  return (
    <div className="scrolling-rows-container">
      {/* Row 1 - Left to Right */}
      <div className="scrolling-row row-left-to-right">
        <div className="scrolling-track">
          {createRowImages().map((src, index) => (
            <div key={`row1-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1}`} />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {createRowImages().map((src, index) => (
            <div key={`row1-dup-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1} duplicate`} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Right to Left */}
      <div className="scrolling-row row-right-to-left">
        <div className="scrolling-track">
          {createRowImages().map((src, index) => (
            <div key={`row2-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1}`} />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {createRowImages().map((src, index) => (
            <div key={`row2-dup-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1} duplicate`} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 - Left to Right */}
      <div className="scrolling-row row-left-to-right">
        <div className="scrolling-track">
          {createRowImages().map((src, index) => (
            <div key={`row3-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1}`} />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {createRowImages().map((src, index) => (
            <div key={`row3-dup-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1} duplicate`} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 4 - Right to Left */}
      <div className="scrolling-row row-right-to-left">
        <div className="scrolling-track">
          {createRowImages().map((src, index) => (
            <div key={`row4-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1}`} />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {createRowImages().map((src, index) => (
            <div key={`row4-dup-${index}`} className="scrolling-image">
              <img src={src} alt={`Maritime ${index + 1} duplicate`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingImageRows;