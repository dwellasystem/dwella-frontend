import { useMemo } from "react";
import { useGetAssignedUnits } from "../../hooks/assigned-unit/useGetAssignedUnits";

type UnitListProps = {
    id?: string;
}

const UnitList = ({id}: UnitListProps) => {
  const filter = useMemo(() => {
    return {
        assigned_by: id
    }
  }, [id])

  const {units} = useGetAssignedUnits(filter);

  // Join unit names with commas
  const unitNames = useMemo(() => {
    if (!units || units.length === 0) return '';
    return units.map((unit:any) => unit.unit_id?.unit_name + `(${unit.unit_id.building})`).join(', ');
  }, [units]);
  
  return (
    <div>{unitNames}</div>
  )
}

export default UnitList