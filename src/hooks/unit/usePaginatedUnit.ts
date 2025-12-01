import { useEffect, useState } from "react"
import type { Paginated } from "../../models/Paginated.model";
import type { Unit } from "../../models/Unit.model";
import { API_BASE_URL } from "../../api/endpoint";
import api from "../../api/api";
import UnitService from "../../services/unit.service";

export const usePaginatedUnits = (filters?: {}) => {
    const [paginatedUnits, setPaginatedUnits] = useState<Paginated<Unit>>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const {createUnit, updateUnitById, deletUnitById} = UnitService();

    const URL = `${API_BASE_URL}/units/paginated`;
    
    const fetchPaginatedUnits = async () => {
        const response = await api.get(URL, {params: filters});
        setPaginatedUnits(response.data);
    }

    const createNewUnit = async (data: any) => {
       await createUnit(data);
       fetchPaginatedUnits();
    }

    const updateUnit = async (id: string, data: any) => {
        await updateUnitById(id, data)
        fetchPaginatedUnits();
    }

    const deleteUnit = async (id: string) => {
        await deletUnitById(id);
        fetchPaginatedUnits();
    }

    const nextButton = async (url: string) => {
        const response = await api.get(url);
        setPaginatedUnits(response.data);
        setPageNumber((prev) => prev + 1);
    };

    const prevButton = async (url: string) => {
        const response = await api.get(url);
        setPaginatedUnits(response.data);
        setPageNumber((prev) => prev - 1);
    };

    useEffect(() => {
        fetchPaginatedUnits();
    },[filters])
    return {
        paginatedUnits,
        createNewUnit,
        deleteUnit,
        updateUnit,
        nextButton,
        prevButton,
        pageNumber
    }
}