import axios from "axios";
import { useEffect, useState } from "react"
import { API_BASE_URL } from "../../api/endpoint";

type BillStats = {
    year: string;
    month: string;
    paid_count: number;
    pending_count: number;
    overdue_count: number;
    total_paid: number;
    total_pending: number;
}

function useBillStats() {
  const [billStats, setBillStats] = useState<BillStats[] | undefined>();

  const fetchBillStats = async () => {
    const response = await axios.get<BillStats[]>(`${API_BASE_URL}/bills/stats/`);
    setBillStats(response.data)
  }
  
  useEffect(() => {
    fetchBillStats();
  }, [])

  return {
    billStats
  }
}

export default useBillStats