import { createFileRoute, useNavigate } from '@tanstack/react-router'
import SubmitRequest from '../../../pages/resident/SubmitRequest'
import { useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/auth/AuthContext';
import { useInquiry } from '../../../hooks/inquiries/useInquiry';
import { useGetAssignedUnits } from '../../../hooks/assigned-unit/useGetAssignedUnits';

export const Route = createFileRoute('/_protected/resident/submit-request')({
  component: RouteComponent,
})

type FormType = {
  resident: number | undefined;
  unit: number | undefined;
  type: string;
  title: string;
  description: string;
  // photo?: File | null;
};

const initialFormData: FormType = {
  resident: undefined,
  unit: undefined,
  type: "",
  title: "",
  description: "",
  // photo: undefined,
};

function RouteComponent() {
  const {user} = useAuth();
  const {createNewInquiry} = useInquiry();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({...initialFormData, resident: user?.id});

  const convertFormDataToMultipart = (data: FormType) => {
    const formData = new FormData();

      Object.keys(data).forEach((key) => {
      const value = data[key as keyof FormType];
      if (value !== undefined && value !== null) {
        formData.append(key, data[key as keyof FormType] as string | Blob);
      }
    })
    return formData;
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = convertFormDataToMultipart(formData);
    
    if(!formData.resident || !formData.title.trim() || !formData.description.trim() || !formData.type || !formData.unit){
      return console.error("required fields");
    }

    await createNewInquiry(data, {'Content-Type': 'multipart/form-data'});
    console.log(formData)
    navigate({to:'/resident/inquiries'})
    setFormData(initialFormData);
  }


  // const {units} = useGetUnits();
  const filter = useMemo(() => {
    return {
      assigned_by: user?.id
    }
  },[user?.id])
  const {units} = useGetAssignedUnits(filter);
  return <SubmitRequest formData={formData} submitForm={submitForm} setFormData={setFormData}  units={units as any}/>
}
