import { useEffect, useState } from "react"
import AssignedUnitService from "../../services/assignedUnit.service";
import type { Unit } from "recharts/types/cartesian/CartesianAxis";
import type { User } from "../../models/User.model";

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

export const useGetAssignedUnits = (filter?: {}) => {
    const [units, setUnits] = useState<AssignedUnitPopulated[]>();
    const {getAssigneUnits} = AssignedUnitService();

    const fetchUnits = async () => {
        const response = await getAssigneUnits(filter);
        setUnits(response.data)
    }

    useEffect(() => {
        fetchUnits();
    }, [filter])

    return {
        units,
    } 
}