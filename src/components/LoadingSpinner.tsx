import { Spinner } from "react-bootstrap";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div 
      className="d-flex flex-column justify-content-center align-items-center vh-100" 
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem", color: "#344CB7" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3 text-secondary fw-semibold">{text}</p>
    </div>
  );
}
