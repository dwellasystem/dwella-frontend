import { createFileRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Button, Container, Stack, Dropdown, Modal, Form } from 'react-bootstrap';
import Header from '../../../../../components/Header';
import { IoMdAdd, IoMdDownload } from 'react-icons/io';
import Search from '../../../../../components/Search';
import { useMemo, useState } from 'react';
import { FiltersContext } from '../../../../../contexts/FilterContext';
import { API_BASE_URL } from '../../../../../api/endpoint';

export const Route = createFileRoute('/_protected/admin/financial/_financial')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation();
  const navigate = useNavigate();

   // ✅ State for search and ordering
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');

  // ✅ Download modal state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadYear, setDownloadYear] = useState(new Date().getFullYear());
  const [downloadMonth, setDownloadMonth] = useState('all');
  const [downloadStatus, setDownloadStatus] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);

  // ✅ Memoize filters (to prevent infinite requests)
  const filters = useMemo(
    () => ({
      search: searchTerm,
      ordering: orderBy,
      payment_type: orderBy,
    }),
    [searchTerm, orderBy]
  );

  // ✅ Generate years array (current year and previous 5 years)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  // ✅ Months array
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // ✅ Status options
  const statusOptions = [
    { value: 'all', label: 'All Paid/Done Bills' },
    { value: 'paid', label: 'Only Paid (Payment Status)' },
    { value: 'done', label: 'Only Done (Due Status)' },
  ];

  // ✅ Download Excel function
  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        year: downloadYear.toString(),
        month: downloadMonth,
        status: downloadStatus,
      });

      const url = `${API_BASE_URL}/bills/export/paid-bills/excel/?${params}`;
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'true');
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Close modal after successful download initiation
      setShowDownloadModal(false);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ Download CSV function
  // const handleDownloadCSV = async () => {
  //   setIsDownloading(true);
  //   try {
  //     // Build query parameters
  //     const params = new URLSearchParams({
  //       year: downloadYear.toString(),
  //       month: downloadMonth,
  //       status: downloadStatus,
  //     });

  //     const url = `http://localhost:8000/api/bills/export/paid-bills/csv/?${params}`;
      
  //     // Create a temporary anchor element to trigger download
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'true');
      
  //     // Append to body, click, and remove
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
      
  //     // Close modal after successful download initiation
  //     setShowDownloadModal(false);
      
  //   } catch (error) {
  //     console.error('Download failed:', error);
  //     alert('Download failed. Please try again.');
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  return (
    <FiltersContext.Provider value={{ filters }}>
      <Container className="pt-sm-5 d-flex w-100 h-100 overflow-auto flex-column">
        {/* Header component*/}
        <Header path={"admin"}>
          <div className="d-flex gap-3">
            <div
              onClick={() => navigate({ to: "/admin/financial/record-payment" })}
              className="d-flex align-items-center gap-2 py-3 px-5 rounded-3"
              style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
            >
              <IoMdAdd size={25} color="white" />
              <a className="text-decoration-none text-light fw-bold">Record</a>
            </div>
          </div>
        </Header>

        {/* Search engine component with download button*/}
        <Search 
          sortByDateOptions={true} 
          sortByPaymentType={true} 
          sortByAmountOptions={true} 
          onSearch={(val) => setSearchTerm(val)} 
          onOrderChange={(val) => setOrderBy(val)}
        >
          <Dropdown>
            <Dropdown.Toggle 
              className="d-flex align-items-center gap-2 px-4 py-3 rounded-3 border-0"
              style={{ backgroundColor: "#2a2c35d7", cursor: "pointer" }}
            >
              <IoMdDownload />
              <span className="fw-bold">Download</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowDownloadModal(true)}>
                📊 Download Excel Report
              </Dropdown.Item>
              {/* <Dropdown.Item onClick={handleDownloadCSV}>
                📄 Download CSV Report (Current View)
              </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </Search>

        <Stack direction="horizontal" gap={3}>
          <Button
            onClick={() => navigate({to:'/admin/financial'})}
            className="text-decoration-none fw-bold text-black rounded-0 border-primary border-end-0 border-start-0 border-top-0"
            style={{
              background:'white',
              borderBottom: location.pathname.endsWith("/financial")
                ? "#344CB7 5px solid"
                : "none",
            }}
          >
            Payment Records
          </Button>
          {/* <Button
            onClick={() => navigate({to:'/admin/financial/monthly-due'})}
            className="text-decoration-none fw-bold text-black rounded-0 border-primary border-end-0 border-start-0 border-top-0"
            style={{
              background:'white',
              borderBottom: location.pathname.endsWith("/financial/monthly-due")
                ? "#344CB7 5px solid"
                : "none",
            }}
          >
            Monthly Dues
          </Button> */}

          {location.pathname.endsWith("/financial/monthly-due") && <Link to='/admin/financial/upload' className='ms-auto text-decoration-none border border-primary px-3 py-2 rounded-3 fw-bold'>+ Upload</Link>}
        </Stack>
        <Outlet />

        {/* Download Modal */}
        <Modal show={showDownloadModal} onHide={() => setShowDownloadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Download Financial Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Select 
                  value={downloadYear} 
                  onChange={(e) => setDownloadYear(parseInt(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Month</Form.Label>
                <Form.Select 
                  value={downloadMonth} 
                  onChange={(e) => setDownloadMonth(e.target.value)}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={downloadStatus} 
                  onChange={(e) => setDownloadStatus(e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowDownloadModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleDownloadExcel}
              disabled={isDownloading}
              style={{ backgroundColor: '#344CB7', borderColor: '#344CB7' }}
            >
              {isDownloading ? 'Downloading...' : 'Download Excel'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </FiltersContext.Provider>
  );
}