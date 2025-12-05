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

export const useGetAssignedUnits = (filter?: any) => {
    const [units, setUnits] = useState<AssignedUnitPopulated[]>();
    const {getAssigneUnits} = AssignedUnitService();

    const fetchUnits = async () => {
        const response = await getAssigneUnits(filter);
        setUnits(response.data)
    }

    useEffect(() => {
         // CRITICAL: Don't fetch if filter doesn't have assigned_by
        if (!filter || filter.assigned_by === undefined || filter.assigned_by === null) {
            setUnits([]); // Clear any previous units
            return;
        }
        fetchUnits();
    }, [filter])

    return {
        units,
    } 
}