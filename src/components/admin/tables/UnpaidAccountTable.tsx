import { Table } from "react-bootstrap";
import type { MonthlyBill } from "../../../models/MonthlyBill.model";
import { formatDateToHumanReadable } from "../../../helpers/authHelper/dateHelper";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../contexts/auth/AuthContext";

type Props = {
  unpaidAccounts?: MonthlyBill[];
  deleteBill: (id: number) => void;
}

function UnpaidAccountTable({unpaidAccounts, deleteBill}: Props) {

  const navigate = useNavigate();
  const {role} = useAuth();

  return (
    <div className="w-100 d-flex flex-column gap-3 pt-2">
      <div className="overflow-auto">
        <Table responsive="sm" className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: "#F2F2F7" }}>Building</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Unit Number</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Resident Name</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Amount Due</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Payment Status</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Due Date</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unpaidAccounts?.map((row) => (
              <tr key={row.id} className="text-nowrap">
                <td>{row.unit.building}</td>
                <td>{row.unit.unit_name}</td>
                <td>{row.user.first_name} {row.user.middle_name} {row.user.last_name}</td>
                <td>{row.amount_due}</td>
                <td>{row.due_status}</td>
                <td>{formatDateToHumanReadable(row.due_date)}</td>
                <td className="d-flex align-items-center justify-content-center gap-2">
                  <div onClick={() => navigate({to:`/${role}/monthly-bill/$id/edit`, params:{id: row.id.toString()}})} className='text-primary fw-bold fs-5' style={{cursor:'pointer'}}><FaPencilAlt /></div>
                  <div onClick={() => deleteBill(row.id)} className='text-danger fw-bold fs-5' style={{cursor:'pointer'}}><FaRegTrashAlt /></div>
                  <div onClick={() => navigate({to:`/${role}/monthly-bill/$id`, params:{id: row.id.toString()}})} className='text-primary fw-bold fs-5' style={{cursor:'pointer'}}><IoMdEye /></div>
                </td>
              </tr>
            ))}
            {unpaidAccounts && unpaidAccounts.length < 1 && <tr><td colSpan={6} className="text-center">No Bill found.</td></tr>}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default UnpaidAccountTable;
