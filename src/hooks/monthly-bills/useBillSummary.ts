import axios from "axios";
import { useEffect, useState } from "react"
import { API_BASE_URL } from "../../api/endpoint";

type BillSummary = {
    month: string,
    year: number,
    totalDue: number,
    totalCollectedPayment: number,
    totalOverDue: number,
    totalPending: number,
    all_overdue_bills: number
}

function useBillSummary() {
  const [billSummary, setBillSummary] = useState<BillSummary | undefined>();

  const fetchBillSummary = async () => {
    const response = await axios.get<BillSummary>(`${API_BASE_URL}/bills/summary/`);
    setBillSummary(response.data)
  }
  
  useEffect(() => {
    fetchBillSummary();
  }, [])

  return {
    billSummary
  }
}

export default useBillSummary