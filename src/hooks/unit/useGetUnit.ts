import { useEffect, useState } from "react"
import { type Unit } from "../../models/Unit.model"
import UnitService from "../../services/unit.service"
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";

export const useGetUnit = (id: any) => {
    const {getUnitById} = UnitService();
    const [unit, setUnit] = useState<Unit>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null >(null);

    useEffect(() => {
        if (!id || id === "Select") return; // 🛑 Skip fetch if invalid
        const fetchUnit = async () => {
            try {
                const response = await getUnitById(id);
                setUnit(response.data)
            } 
            catch (error) {
                const err = error as IServiceError
                if(err.status !== 200) setError('Server Error')
            }
            finally{
                setLoading(false)
            }
        }

        fetchUnit();
    },[id])

    return {error, unit, loading}
} 