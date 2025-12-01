import { useEffect, useState } from "react";
import api from "../../api/api";
import { API_BASE_URL } from "../../api/endpoint";

export type UnitStatusSummary = {
  owner_occupied: number;
  rented_short_term: number;
  air_bnb: number;
};

export default function useUnitStatusSummary() {
  const [statusSummary, setStatusSummary] = useState<UnitStatusSummary | null>(null);

  const fetchStatusSummary = async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/unit-status-summary/`);
      setStatusSummary(response.data);
    } catch (error) {
      console.error("Error fetching unit status summary", error);
    }
  };

  useEffect(() => {
    fetchStatusSummary();
  }, []);

  return { statusSummary };
}
