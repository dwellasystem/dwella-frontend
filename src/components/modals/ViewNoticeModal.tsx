import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import type { NoticeDetail } from "../../models/Notice.model";
import { IoMdEye } from "react-icons/io";

type ModalProps = {
  notice: NoticeDetail;
};

function ViewNoticeModal(props: ModalProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <a onClick={handleShow} className="text-primary"><IoMdEye size={25}/></a>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.notice.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="fs-5">
            {props.notice.content}
          </section>
          <section className="my-2">
            <div>
              <label className="text-decoration-underline fw-medium">
                Target Audience:{" "}
              </label>
              {props.notice.target_audience.length > 0 ? (
                props.notice.target_audience.map((audience) => (
                  <span
                    className="custom-bg text-white mx-1 px-3 rounded-3"
                    key={audience.id}
                  >
                    {audience.unit_id.unit_name}
                  </span>
                ))
              ) : (
                <span className="custom-bg text-white mx-1 px-3 rounded-3">
                  All
                </span>
              )}
              <br />
              <label className="text-decoration-underline fw-medium">
                Type:
              </label>
              <span className="custom-bg text-white mx-1 px-3 rounded-3">
                {props.notice.notice_type.name}
              </span>
            </div>
          </section>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Back
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewNoticeModal;