import { useEffect, useState } from "react"
import api from "../../api/api";
import { API_BASE_URL } from "../../api/endpoint";
import type { MonthlyBill } from "../../models/MonthlyBill.model";

function useBilling(filters?:{}) {
  const [billing, setBilling] = useState<MonthlyBill[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBilling = async () => {
    setLoading(true);
    try {
        const response = await api.get(`${API_BASE_URL}/bills/`, {params: filters});
        setBilling(response.data);
    } catch (error) {
        
    }finally{
       setLoading(false);
    }
  }

  useEffect(() => {
    fetchBilling();
  },[filters])

  return {
    billing,
    loading
  }
}

export default useBilling