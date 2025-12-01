import { Col } from "react-bootstrap"

interface CardsProps {
    heading: string
    description?: string | undefined;
}

function Cards({heading, description}:CardsProps) {
  return (
    <Col className="p-4 rounded-3 d-flex align-items-start justify-content-start gap-3 flex-column text-start" style={{backgroundColor: "#F2F2F7"}}>
        <span>{heading}</span> <h5 className="fw-bold">{description}</h5>
    </Col>
  )
}

export default Cards