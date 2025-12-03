// src/hooks/hoa-information/useHoaInformation.ts
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { API_BASE_URL } from '../../api/endpoint';
import type { HoaInfoType } from '../../components/HoaInformation';


export const useHoaInformation = () => {
  const [hoaInfo, setHoaInfo] = useState<HoaInfoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch HOA information
  const fetchHoaInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/hoa-information/`);
      
      // API returns an array, take the first item
      if (response.data && response.data.length > 0) {
        setHoaInfo(response.data[0]);
      } else {
        setHoaInfo(null);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching HOA information:', err);
      setError(err.message || 'Failed to load HOA information');
    } finally {
      setLoading(false);
    }
  };

  // Update HOA information
  const updateHoaInformation = async (id: number, data: Partial<HoaInfoType>) => {
    try {
      const response = await api.put(`${API_BASE_URL}/hoa-information/${id}/`, data);
      setHoaInfo(response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error updating HOA information:', err);
      throw err;
    }
  };

  // Create HOA information
  const createHoaInformation = async (data: Partial<HoaInfoType>) => {
    try {
      const response = await api.post(`${API_BASE_URL}/hoa-information/`, data);
      setHoaInfo(response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error creating HOA information:', err);
      throw err;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchHoaInfo();
  }, []);

  return {
    hoaInfo,
    loading,
    error,
    fetchHoaInfo,
    updateHoaInformation,
    createHoaInformation
  };
};