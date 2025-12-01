import { useEffect, useState } from "react";
import type { BaseModel } from "../../models/BaseModel";
import type { Unit } from "../../models/Unit.model";
import type { User } from "../../models/User.model";
import api from "../../api/api";

export interface AssignedUnit extends BaseModel {
    id?: number;
    unit_id?: Unit;
    assigned_by?: User;
}

export const useAssignedUnit = (id?: number) => {
    const [assigneUnit, setAssignedUnit] = useState<AssignedUnit>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAssignedUnit = async (userId: number) => {
        try {
            setLoading(true);
            // Simulate API call
            const response = await api.get(`http://127.0.0.1:8000/api/assigned_unit/${userId}/details`);
            setAssignedUnit(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // ✅ Clear old unit immediately
        setAssignedUnit(undefined);
        setLoading(true);
        if (id) {
            fetchAssignedUnit(id);
        }
    }, [id]);

    return {loading, assigneUnit, error};
}