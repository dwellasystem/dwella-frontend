import { useEffect, useState } from "react";
import InquiryService from "../../services/inquiries.service";
import type { Paginated } from "../../models/Paginated.model";
import type { Inquiry } from "../../models/Inquiry.model";
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import api from "../../api/api";

export const useInquiry = (filters?:{}) => {
  const [inquiries, setInquiries] = useState<Paginated<Inquiry>>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const {
    getInquiries,
    createInquiry,
    deleteInquiryById,
    updateInquiryById,
    getInquiryById,
  } = InquiryService();

  const fetchInquiries = async (filters: {} = {}) => {
    try {
      const response = await getInquiries(filters);
      setInquiries(response);
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const nextButton = async (url: string) => {
    const response = await api.get(url);
    setInquiries(response.data);
    setPageNumber((prev) => prev + 1);
  };

  const prevButton = async (url: string) => {
    const response = await api.get(url);
    setInquiries(response.data);
    setPageNumber((prev) => prev - 1);
  };

  const createNewInquiry = async (body: {}, headers?:{}) => {
    try {
      await createInquiry(body, headers);
      return await fetchInquiries(filters);
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
      console.log(error);
    }
  };

  const viewInquiry = async (id: number) => {
    try {
      const response = await getInquiryById(id);
      console.log(response);
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
      console.log(error);
    }
  };

  const updateInquiry = async (id: number, body: {}) => {
    try {
      await updateInquiryById(id, body);
      await fetchInquiries();
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("This user is no longer available");
      console.log(error);
    }
  };

  const deleteInquiry = async (id: number) => {
    try {
      await deleteInquiryById(id);
      await fetchInquiries();
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
      console.log(error);
    }
  };

  const filterInquiries = async (params: {}) => {
    try {
      const response = await getInquiries(params);
      setInquiries(response);
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
      console.log(error);
    }
  }

    useEffect(() => {
      fetchInquiries(filters);
    }, [filters]);

  return {
    inquiries,
    loading,
    error,
    nextButton,
    prevButton,
    pageNumber,
    createNewInquiry,
    viewInquiry,
    deleteInquiry,
    updateInquiry,
    filterInquiries
  };
};
