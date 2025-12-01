import { useEffect, useState, type ReactNode } from "react";
import { Dropdown, Form, InputGroup } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { IoOptionsOutline } from "react-icons/io5";

interface SearchProps {
  children?: ReactNode;
  onSearch?: (value: string) => void;
  onOrderChange?: (value: string) => void;
  onStatusChange?: (value: string ) => void;
  sortByAmountOptions?: boolean;
  sortByDateOptions?: boolean;
  sortByMoveInDateOptions?: boolean;
  sortByType?: boolean;
  sortByInquiryType?: boolean;
  sortByAccountStatus?: boolean;
  sortByPaymentStatus?: boolean;
  sortByAmountDueOptions?: boolean;
  sortByPaymentStatusOptions?: boolean;
  sortByAssignedUnits?: boolean;
  sortByAvailableUnits?: boolean;
  sortByBuilding?:boolean;
  sortByPaymentType?: boolean;
}

function Search({ children, onSearch, onOrderChange, sortByPaymentType, onStatusChange, sortByBuilding, sortByAvailableUnits, sortByAssignedUnits, sortByPaymentStatusOptions, sortByAmountDueOptions, sortByPaymentStatus, sortByAccountStatus, sortByAmountOptions, sortByInquiryType, sortByDateOptions, sortByMoveInDateOptions, sortByType}: SearchProps) {

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);


  // ⏱ debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000); // wait 1000ms or 1s after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Call parent callback only when debouncedQuery changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div className="d-flex justify-content-between align-items-center flex-column gap-5 flex-md-row pt-5 mt-5 mb-3">
      <div className="d-flex align-items-center gap-2">
        <InputGroup>
          <InputGroup.Text
            className="border-0"
            style={{ backgroundColor: "#F2F2F7" }}
          >
            <IoIosSearch />
          </InputGroup.Text>
          <Form.Control
            name="search"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            className="border-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ backgroundColor: "#F2F2F7" }}
          />
        </InputGroup>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            <IoOptionsOutline size={25} style={{ cursor: "pointer" }} />
          </Dropdown.Toggle>

          <Dropdown.Menu>

            {/* Sort for the list of financials in residents */}
            {sortByPaymentStatus && <><Dropdown.Header>Sort by Payment Status</Dropdown.Header>
              <Dropdown.Item onClick={() => onOrderChange && onOrderChange("")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOrderChange && onOrderChange("paid")}>
                Paid
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOrderChange && onOrderChange("pending")}>
                Pending
              </Dropdown.Item></>}
            {/* Sort for the list of residents */}
            {sortByMoveInDateOptions && <><Dropdown.Header>Sort by Move in date</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("-move_in_date")}>
              Move in date ↑ (Newest First)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("move_in_date")}>
              Move in date ↓ (Oldes First)
            </Dropdown.Item></>}

            {/* Sort for the list of inquiries */}
            {sortByInquiryType && <><Dropdown.Header>Sort by Inquiry Type</Dropdown.Header>
              <Dropdown.Item onClick={() => onOrderChange && onOrderChange("")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOrderChange && onOrderChange("complaint")}>
                Complaint
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOrderChange && onOrderChange("question")}>
                Question
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOrderChange && onOrderChange("request")}>
                Request
              </Dropdown.Item></>}


            {/* Sort for the list of notices */}
            {sortByType && <><Dropdown.Header>Sort by Move in date</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("")}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("3")}>
              Monthly Due
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("2")}>
              Holiday
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("1")}>
              Maintenance
            </Dropdown.Item></>}
           
            {/* Sort for the list of payments */}
           
            {sortByPaymentType && <><Dropdown.Header>Payment type</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("regular")}>
              Monthly Payment
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("advance")}>
              Advance Payment
            </Dropdown.Item></>}
           
           {sortByAmountOptions && <><Dropdown.Header>Sort by Amount</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("amount")}>
              Amount ↑
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("-amount")}>
              Amount ↓
            </Dropdown.Item></>}

            {sortByAmountOptions && sortByDateOptions && <Dropdown.Divider />}

             {/* Sort for the list of payments */}
            {sortByDateOptions && <><Dropdown.Header>Sort by Date</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("bill__due_date")}>
              Date ↑ (Oldest First)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("-bill__due_date")}>
              Date ↓ (Newest First)
            </Dropdown.Item></>}

             {/* Sort for the list of employees */}
            {sortByAccountStatus && <><Dropdown.Header>Sort by account status</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("active")}>
              Active
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("inactive")}>
              Inactive
            </Dropdown.Item></>}

             {/* Sort for the list of employees */}
            {sortByAssignedUnits && <><Dropdown.Header>Sort by account status</Dropdown.Header>
            <Dropdown.Item onClick={() => onStatusChange && onStatusChange("air_bnb")}>
              Air Bnb
            </Dropdown.Item>
             <Dropdown.Item onClick={() => onStatusChange && onStatusChange("owner_occupied")}>
              Owner Occupied
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onStatusChange && onStatusChange("rented_short_term")}>
              Rented
            </Dropdown.Item></>}

              {/* Sort for the list of bills */}
            {sortByAmountDueOptions && <><Dropdown.Header>Sort by Amount</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("amount_due")}>
              Due Amount ↑
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("-amount_due")}>
              Due Amount ↓
            </Dropdown.Item></>}

              {/* Sort for the list of bills */}
            {sortByBuilding && <><Dropdown.Header>Sort building by alphabetical</Dropdown.Header>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("-unit__building")}>
              z-A ↑
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onOrderChange && onOrderChange("unit__building")}>
              A-z ↓
            </Dropdown.Item></>}

              {/* Sort for the list of bills */}
            {sortByPaymentStatusOptions && <><Dropdown.Header>Sort by Amount</Dropdown.Header>
              <Dropdown.Item onClick={() => onStatusChange && onStatusChange("done")}>
                Done
              </Dropdown.Item>
             <Dropdown.Item onClick={() => onStatusChange && onStatusChange("overdue")}>
              Overdue
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onStatusChange && onStatusChange("due_today")}>
              Due Today
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onStatusChange && onStatusChange("upcoming")}>
              Upcoming
            </Dropdown.Item></>}
            

             {/* Sort for the available units */}
            {sortByAvailableUnits && <><Dropdown.Header>Sort by Amount</Dropdown.Header>
            <Dropdown.Item onClick={() => onStatusChange && onStatusChange('true')}>
              Available
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onStatusChange && onStatusChange('false')}>
              Occupied
            </Dropdown.Item></>}

          </Dropdown.Menu>
        </Dropdown>
        
      </div>
      {children}
    </div>
  );
}

export default Search;
