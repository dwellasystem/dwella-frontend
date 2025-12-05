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
  photo?: File | null;
};

type FormErrors = {
  unit?: string;
  type?: string;
  title?: string;
  description?: string;
  [key: string]: string | undefined;
};

const initialFormData: FormType = {
  resident: undefined,
  unit: undefined,
  type: "",
  title: "",
  description: "",
  photo: undefined,
};

const initialFormErrors: FormErrors = {
  unit: "",
  type: "",
  title: "",
  description: "",
};

function RouteComponent() {
  const {user} = useAuth();
  const {createNewInquiry} = useInquiry();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({...initialFormData, resident: user?.id});
  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.unit) {
      errors.unit = "Unit number is required";
    }
    
    if (!formData.type.trim()) {
      errors.type = "Type is required";
    }
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const convertFormDataToMultipart = (data: FormType) => {
  const formData = new FormData();

  console.log("Converting form data:", data);

  // Append all fields
  Object.keys(data).forEach((key) => {
    const value = data[key as keyof FormType];
    if (value !== undefined && value !== null) {
      if (key === 'photo' && value instanceof File) {
        formData.append(key, value);
        console.log(`Appended ${key}: [File] ${value.name}`);
      } 
      else if (key !== 'photo') {
        formData.append(key, value.toString());
        console.log(`Appended ${key}: ${value.toString()}`);
      }
    } else {
      console.log(`Skipped ${key}: value is ${value}`);
    }
  });
  
  // Debug: Show all FormData entries
  console.log("FormData entries:");
  for (let [key, val] of formData.entries()) {
    console.log(key, val);
  }
  
  return formData;
};

  const submitForm = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Create data with guaranteed resident
  const dataToSend = {
    ...formData,
    resident: formData.resident || user?.id
  };
  
  // Validate with the guaranteed data
  const errors: FormErrors = {};
  if (!dataToSend.unit) errors.unit = "Unit number is required";
  if (!dataToSend.type.trim()) errors.type = "Type is required";
  if (!dataToSend.title.trim()) errors.title = "Title is required";
  if (!dataToSend.description.trim()) errors.description = "Description is required";

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("Data being sent:", dataToSend);
    const data = convertFormDataToMultipart(dataToSend);
    await createNewInquiry(data, {'Content-Type': 'multipart/form-data'});
    
    // Reset form with current user
    setFormData({
      ...initialFormData,
      resident: user?.id
    });
    setFormErrors(initialFormErrors);
    navigate({to:'/resident/inquiries'});
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const filter = useMemo(() => {
     if (!user?.id) return null;
    return {
      assigned_by: user?.id
    }
  },[user?.id]);

  const {units} = useGetAssignedUnits(filter);

  return (
    <SubmitRequest 
      formData={formData} 
      formErrors={formErrors}
      isSubmitting={isSubmitting}
      submitForm={submitForm} 
      setFormData={setFormData}
      units={units as any}
    />
  );
}