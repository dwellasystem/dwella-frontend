import { useEffect, useState } from "react";
import type { AssignedUnit } from "../../models/AssigneUnit.model";
import AssignedUnitService from "../../services/assignedUnit.service";

export const useGetAssignedUnit = (id?: any) => {
    const {getAssigneUnitById} = AssignedUnitService();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [assignedUnit, setAssignedUnit] = useState<AssignedUnit>();

    useEffect(() => {
        if (!id) {
            setError("No ID provided");
            setLoading(false);
            return;
        }
        const fetchAssignedUnits = async () => {
            try {
                setLoading(true);
                const response = await getAssigneUnitById(id); // Adjust the API endpoint as needed
                setAssignedUnit(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedUnits();
    },[id]);

    return {loading, assignedUnit, error};
}