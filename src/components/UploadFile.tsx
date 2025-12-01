import React, { useRef, useState, type ChangeEvent, type Dispatch, type DragEvent, type SetStateAction } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { IoMdCloudUpload } from 'react-icons/io';

type WithPhoto = {
  photo?: File | null;
};

type Props<T> = {
  title: string;
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
};

function UploadFile<T extends WithPhoto>({title, formData, setFormData}:Props<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle the file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // only first file
    if (selectedFile) {
      setFormData((prev) => ({ ...prev, photo: selectedFile }));
    }
  };

  // Trigger the file input click
  const handleAnchorClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault();
    fileInputRef.current?.click();
  };

  // Handle file drop
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0]; // only first file
    if (droppedFile) {
      setFormData((prev) => ({ ...prev, photo: droppedFile }));
    }
  };

  // Highlight drag area
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <Form.Group className="mb-3" controlId="formUploadFile">
      <Form.Label>{title}</Form.Label>
      <Container
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        fluid
        style={{
          overflow: "auto",
          border: `1px ${isDragging ? "blue" : "#B3B3B3"} dashed`,
          padding: "1rem",
          maxHeight: "15rem",
          transition: "background-color 0.2s ease-in-out",
          backgroundColor: `${isDragging ? "rgba(52, 76,183, 0.3)" : "white"}`,
        }}
      >
        <Row>
          <Col xs="12" className="text-center">
            <IoMdCloudUpload color="#344CB7" size={40} />
          </Col>

          <input
            id="formUploadFile"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="d-none"
          />

          <Col xs="12" className="text-center">
            <p>
              Drag and drop a file or{" "}
              <span
                className="text-decoration-underline fw-bold"
                style={{ color: "#344CB7", cursor: "pointer" }}
                onClick={handleAnchorClick}
              >
                Browse
              </span>
            </p>
            <p className="custom-font-size text-muted">
              Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
            </p>
          </Col>
        </Row>

        {/* Display selected file */}
        {formData.photo && (
          <div className="mt-3 p-2 border rounded text-center">
            <strong>{formData.photo.name}</strong>
          </div>
        )}
      </Container>
    </Form.Group>
  );
}

export default UploadFile
