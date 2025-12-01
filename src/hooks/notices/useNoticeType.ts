import { useEffect, useState } from "react";
import api from "../../api/api";
import { API_BASE_URL } from "../../api/endpoint";
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import type { NoticeType } from "../../models/NoticeType.model";

export const useNoticeType = () => {
  const [noticeTypes, setNoticeTypes] = useState<NoticeType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNoticeTypes = async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/notice-types`);
      setNoticeTypes(response.data)
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticeTypes();
  }, []);

  return {
    fetchNoticeTypes,
    noticeTypes,
    loading,
    error
  }
};
