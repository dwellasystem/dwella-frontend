import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegTrashAlt } from "react-icons/fa";

type Props = {
    deleteItem: string;
    confirmDelete: () => void;
}

function MessageModal({deleteItem, confirmDelete}: Props) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false)
  };
  const handleShow = () => setShow(true);

  const handleConfirmDelete = () => {
    handleClose();
    confirmDelete();
  }

  return (
    <div>
      <OverlayTrigger
          placement={'top'}
          overlay={
            <Tooltip id={`tooltip-top`}>
              Delete
            </Tooltip>
          }
        >
        <a onClick={handleShow} className='text-danger fw-bold' style={{cursor:'pointer'}}><FaRegTrashAlt size={20}/></a>
      </OverlayTrigger>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are going to delete the "{deleteItem}". Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MessageModal;
