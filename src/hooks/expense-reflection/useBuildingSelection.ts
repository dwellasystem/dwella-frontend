// hooks/expense-reflection/useBuildingSelection.ts
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { API_BASE_URL } from '../../api/endpoint';

interface UseBuildingSelectionReturn {
  buildings: string[];
  selectedBuilding: string | null;
  setSelectedBuilding: (building: string | null) => void;
  loading: boolean;
}

const useBuildingSelection = (): UseBuildingSelectionReturn => {
  const [buildings, setBuildings] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        // Call the expense-reflection endpoint to get available buildings
        const response = await api.get(`${API_BASE_URL}/bills/expense-reflection/`);
        
        // Get buildings from the response if available
        if (response.data.available_buildings) {
          setBuildings(response.data.available_buildings);
          if (response.data.available_buildings.length > 0) {
            setSelectedBuilding(response.data.available_buildings[0]);
          }
        } else {
          // If not available, try to fetch from a separate API or use defaults
          // You might need to create an endpoint for this, or extract from existing data
          setBuildings(['Building A', 'Building B', 'Building C']);
          setSelectedBuilding('Building A');
        }
      } catch (error) {
        console.error('Error fetching buildings:', error);
        // Fallback to hardcoded buildings if API fails
        setBuildings(['Building A', 'Building B', 'Building C']);
        setSelectedBuilding('Building A');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return {
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    loading,
  };
};

export default useBuildingSelection;