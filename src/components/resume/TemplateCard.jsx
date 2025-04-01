// components/resume/TemplateCard.js
import React from "react";

const TemplateCard = ({ template, isSelected, onSelect }) => {
  return (
    <div 
      className={`card mb-3 cursor-pointer ${isSelected ? "border-primary border-2" : ""}`}
      onClick={() => onSelect(template)}
      style={{ transition: "all 0.3s" }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h5 className="card-title">{template.name}</h5>
          <span className="badge bg-secondary">{template.ats_score}% ATS</span>
        </div>
        <p className="card-text text-muted small mb-2">{template.category}</p>
        <div className="template-preview" dangerouslySetInnerHTML={{ __html: template.content }} />
      </div>
    </div>
  );
};

export default TemplateCard;