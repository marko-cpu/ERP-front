import React from 'react';

const Card = ({ icon, title, value, colorClass }) => {
  return (
    <div className={`dashboard-card ${colorClass}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {typeof value === "string" || typeof value === "number" ? (
          <p className="card-value">{value}</p>
        ) : (
          <div className="card-value">{value}</div>
        )}
      </div>
    </div>
  );
};

export default Card; 