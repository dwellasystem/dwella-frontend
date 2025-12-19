import { Table } from "react-bootstrap";
import type {NoticeDetail } from "../../../models/Notice.model";
import { useNavigate } from "@tanstack/react-router";
import ViewNoticeModal from "../../modals/ViewNoticeModal";
import MessageModal from "../../modals/MessageModal";
import { FaPencilAlt } from "react-icons/fa";
import { useAuth } from "../../../contexts/auth/AuthContext";

interface Props {
  notices?: NoticeDetail[];
  confirmDelete: (id: number) => Promise<void>
}

function NoticeTable(props: Props) {
  const {role} = useAuth(); 
  const navigate = useNavigate();

  return (
    <div className="w-100 d-flex flex-column">
      <div className="overflow-auto">
        <Table responsive={"sm"} className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: "#F2F2F7" }}>Title</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Type</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Target Audience</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.notices?.map((notice) => (
              <tr key={notice.id} className="text-nowrap">
                <td>{notice.title}</td>
                <td>{notice.notice_type.name}</td>
                <td>
                  {notice.target_audience.length > 0
                    ? notice.target_audience
                        .map((audience) => audience.unit_id.unit_name)
                        .join(",")
                    : "All"}
                </td>
                <td
                  style={{ cursor: "pointer", width: '15%'}}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <a
                      onClick={() =>
                        navigate({
                          to: `/${role}/notices/$noticeId/edit`,
                          params: { noticeId: notice.id.toString() },
                        })
                      }
                    >
                      <FaPencilAlt size={20} />
                    </a>
                    <MessageModal confirmDelete={() => props.confirmDelete(notice.id)} deleteItem={notice.title} />
                    <ViewNoticeModal notice={notice} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {props.notices?.length! === 0 && <h3 className="text-center">No Available Data</h3>}
      </div>
    </div>
  );
}

export default NoticeTable;
