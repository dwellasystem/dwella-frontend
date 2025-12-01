import { useEffect, useState } from "react";
import api from "../../api/api";
import { API_BASE_URL } from "../../api/endpoint";

export type Overdues = {
    user: string,
    unit: string[],
    totalAmountDue: number,
    monthsDue: string[],
}

export const useOverdues = () => {  
    // Logic for managing overdue payments can be added here in the future
    const [overdues, setOverdues] = useState<Overdues[] | null>(null);

    const fetchOverdues = async () => {
        // Fetch or calculate overdue payments data here
        const response = await api.get(`${API_BASE_URL}/overdues/`)
        setOverdues(response.data);
    };

    useEffect(() => {
        // Fetch or calculate overdue payments data here
        fetchOverdues();
    }, []);
    return {
        overdues
    }
}