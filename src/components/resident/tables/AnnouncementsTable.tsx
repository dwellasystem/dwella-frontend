import { Container, Table } from 'react-bootstrap';
import { FiEye } from 'react-icons/fi';
import type { NoticeDetail } from '../../../models/Notice.model';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';
import { useAuth } from '../../../contexts/auth/AuthContext';

type Props = {
  notices?: NoticeDetail[];
  handleShow: (notice: NoticeDetail) => void;
};

function AnnouncementsTable({ notices, handleShow }: Props) {
  const { user } = useAuth();

  // ✅ Filter logic: broadcast (empty) or user is part of target_audience
  const visibleNotices = notices?.filter((notice) => {
    if (notice.target_audience.length === 0) return true; // broadcast to all

    // Otherwise, show only if logged-in user is in target audience
    return notice.target_audience.some(
      (aud) => aud.assigned_by?.id === user?.id
    );
  });

  return (
    <Container className="w-100 d-flex flex-column gap-3">
      <div className="fw-bold" style={{ fontSize: '20px' }}>
        <span style={{ borderBottom: '#344CB7 5px solid' }}>Announcements</span>
      </div>

      <div className="overflow-auto">
        <Table responsive="sm" className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: '#F2F2F7' }}>Type</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Title</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Message</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Date Created</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {visibleNotices && visibleNotices.length > 0 ? (
              visibleNotices.map((notice) => (
                <tr key={notice.id} className="text-nowrap">
                  <td>{notice.notice_type.name}</td>
                  <td>{notice.title}</td>
                  <td>{notice.content}</td>
                  <td>{formatDateToHumanReadable(notice.created_at ?? '')}</td>
                  <td className="text-md-center">
                    <FiEye onClick={() => handleShow(notice)} color="blue" size={20} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No Announcements found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default AnnouncementsTable;
