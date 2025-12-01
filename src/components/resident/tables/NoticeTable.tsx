import { Table } from 'react-bootstrap';
import type { NoticeDetail } from '../../../models/Notice.model';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';
import { useAuth } from '../../../contexts/auth/AuthContext';
import NoticeModalView from '../NoticeModalView';
import { useState } from 'react';

type Props = {
  notices?: NoticeDetail[];
};

function NoticeTable({ notices }: Props) {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null)

  
  // ✅ Filter logic: show all if broadcast, or show if user is part of target_audience
  const visibleNotices = notices?.filter((notice) => {
    if (notice.target_audience.length === 0) return true; // broadcast to all users
    
    // Otherwise, show only if logged-in user is part of target audience
    return notice.target_audience.some(
      (aud) => aud.assigned_by?.id === user?.id
    );
  });
  
  const handleClose = () => setShow(false);
  const handleShow = (notice:NoticeDetail) => {
    setSelectedNotice(notice);
    setShow(true)
  };


  return (
    <div className="w-100 d-flex flex-column">
      <div className="overflow-auto">
        <Table responsive="sm" className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: '#F2F2F7' }}>Title</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Type</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Date Posted</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleNotices?.map((notice) => (
              <tr key={notice.id} className="text-nowrap">
                <td>{notice.title}</td>
                <td>{notice.notice_type.name}</td>
                <td>{formatDateToHumanReadable(notice.created_at ?? '')}</td>
                <td onClick={() => handleShow(notice)}>View</td>
              </tr>
            ))}

            {visibleNotices && visibleNotices.length < 1 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No notices history found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <NoticeModalView onShow={show} onHide={handleClose} selectedNotice={selectedNotice}/>
      </div>
    </div>
  );
}

export default NoticeTable;
