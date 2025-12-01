import { useEffect, useState } from "react"
import { type Unit } from "../../models/Unit.model"
import UnitService from "../../services/unit.service"
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";

export const useGetUnits = (filters?:{}) => {
    const {getUnits} = UnitService();
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null >(null);

    const fetchUnits = async (filter?: {}) => {
        try {
            const response = await getUnits(filter);
            setUnits(response.data)
        } 
        catch (error) {
            const err = error as IServiceError
            if(err.status !== 200) setError('Server Error')
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUnits(filters);
    },[filters])

    return {
        error,
        fetchUnits,
        units, 
        loading
    }
} 