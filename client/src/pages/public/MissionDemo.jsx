import React from 'react';
import MissionCards from '../../components/common/MissionCards';
import './MissionDemo.css';

const MissionDemo = () => {
  return (
    <div className="mission-demo-page">
      <div className="demo-header">
        <h1>Beautiful Mission Cards</h1>
        <p>Showcasing our maritime academy's core values</p>
      </div>

      <MissionCards />

      <div className="demo-footer">
        <p>Experience the power of modern web design with these interactive cards</p>
      </div>
    </div>
  );
};

export default MissionDemo;