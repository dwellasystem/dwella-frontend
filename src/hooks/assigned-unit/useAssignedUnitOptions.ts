import { useEffect, useState } from "react"
import AssignedUnitService from "../../services/assignedUnit.service";

import type { User } from "../../models/User.model";
import type { Unit } from "../../models/Unit.model";

interface AssignedUnitPopulated {
  id?: number;
  unit_id: Unit;
  assigned_by: User;
  building: string;
  security: boolean;
  maintenance: boolean;
  amenities: boolean;
  unit_status: string;
}

export const useAssignedUnitOptions = () => {
    const [units, setUnits] = useState<AssignedUnitPopulated[]>();
    const {getAssigneUnits} = AssignedUnitService();
     const [loading, setLoading] = useState(false);

    const fetchUnits = async () => {
        try {
            const response = await getAssigneUnits();
            setUnits(response.data)
        } catch (error) {
            console.error("Error fetching assigned units:", error);
            setUnits([]);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUnits();
    }, [])

    return {
        units,
        loading
    } 
}