import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const GenericCard = ({ title, icon, description, link, linkText, bgColor }) => {
  return (
    <Card className={`bg-${bgColor} text-white h-100`}>
      <Card.Body className="text-center">
        <i className={`bi bi-${icon} fs-1 mb-3`}></i>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Link to={link} className={`btn btn-light`}>
          {linkText}
        </Link>
      </Card.Body>
    </Card>
  );
};

export default GenericCard;