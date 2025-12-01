import React, { useEffect } from "react";
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import type { Notice, NoticeDetail } from "../../models/Notice.model";
import { NoticeService } from "../../services/notice.service";
import type { Paginated } from "../../models/Paginated.model";
import api from "../../api/api";

export const useNotices = (id?:number, filters: {} = "") => {
  const { getNotices, getNoticeById, updateNoticeById, createNotice, deleteNoticeById } = NoticeService();

  const [notices, setNotices] = React.useState<Paginated<NoticeDetail>>();
  const [notice, setNotice] = React.useState<Notice>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pageNumber, setPageNumber] = React.useState<number>(1);

  const fetchNotices = async (filters: {}) => {
    try {
      const response = await getNotices(filters);
      setNotices(response);
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const nextButton = async (url: string) => {
    const response = await api.get(url);
    setNotices(response.data);
    setPageNumber((prev) => prev + 1);
  };

  const prevButton = async (url: string) => {
    const response = await api.get(url);
    setNotices(response.data);
    setPageNumber((prev) => prev - 1);
  };

  const getNotice = async (id: number) => {
    try {
      const response = await getNoticeById(id);
      setNotice(response);
    } catch (error) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const createNewNotice = async (body: {}) => {
    await createNotice(body);
    return
  }

  const updateNotice = async (id: number, body: {}) => {
    const response = await updateNoticeById(id, body);
    setNotice(response);
    return
  }
  
  const deleteNotice = async (id: number) => {
    await deleteNoticeById(id);
    return fetchNotices(filters);
  }

  // const getNoticeOfUser = async (id: number, filters:{}) => {
  //   const GET_ASSIGNED_NOTICES_API = `http://127.0.0.1:8000/api/assigned_unit/${id}/`;
  //   try {
  //     const response = await api.get(GET_ASSIGNED_NOTICES_API);
  //     fetchNotices({...filters, target_audience: response.data.unit_id});
  //   } catch (error) {
  //     const err = error as IServiceError;
  //     if (err.status !== 200) setError("Server Error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  useEffect(() => {
    //  // Clear old data first to prevent flash
    // setNotices(undefined);
    // setLoading(true);
    if(id){
      // getNoticeOfUser(id, filters);
      fetchNotices(filters);
    }else{
      fetchNotices(filters);
    }
  }, [id, JSON.stringify(filters)]);

  return {
    notices,
    loading,
    error,
    nextButton,
    prevButton,
    pageNumber,
    getNotice,
    updateNotice,
    createNewNotice,
    deleteNotice,
    notice,
    // getNoticeOfUser
  };
};
