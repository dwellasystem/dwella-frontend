import { useEffect, useState } from "react"
import AssignedUnitService from "../../services/assignedUnit.service";
import api from "../../api/api";
import { API_BASE_URL } from "../../api/endpoint";
import type { Paginated } from "../../models/Paginated.model";
import type { PaginatedAssignedUnit } from "../../models/PaginatedAssignedUnit.model";

export const useOwnedUnit = (filters?: {}) => {
  const [ownedUnit, setOwnedUnit] = useState<Paginated<PaginatedAssignedUnit>>();
  const {createAssignedUnit, updateAssigneUnitById, deleteAssigneUnitById} = AssignedUnitService();
  const [pageNumber, setPageNumber] = useState<number>(1);


  const fetchOwnedUnit = async () => {
    const response = await api.get<Paginated<PaginatedAssignedUnit>>(`${API_BASE_URL}/assigned_units/paginated`, {params: filters});
    setOwnedUnit(response.data);
  }

  const assignedToUnit = async (data: {}) => {
    const response = await createAssignedUnit(data);
    console.log(response)
    fetchOwnedUnit();
  }

  const updateUnit = async (id: string, data: {}) => {
    await updateAssigneUnitById(id, data)
    fetchOwnedUnit();
  }

  const deleteAssignedUnit = async (id: string) => {
    await deleteAssigneUnitById(id);
    fetchOwnedUnit();
  }

  const nextButton = async (url: string) => {
    const response = await api.get(url);
    setOwnedUnit(response.data);
    setPageNumber((prev) => prev + 1);
  };

  const prevButton = async (url: string) => {
    const response = await api.get(url);
    setOwnedUnit(response.data);
    setPageNumber((prev) => prev - 1);
  };
  
  useEffect(() => {
    fetchOwnedUnit();
  },[filters])
  
  return {
    ownedUnit,
    assignedToUnit,
    deleteAssignedUnit,
    prevButton,
    nextButton,
    pageNumber,
    updateUnit
  }
}
