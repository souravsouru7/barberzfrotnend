// src/components/FileUpload.js
import React from 'react';

const FileUpload = ({ onFileChange }) => {
  const handleChange = (e) => {
    onFileChange(e.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} required />
    </div>
  );
};

export default FileUpload;
