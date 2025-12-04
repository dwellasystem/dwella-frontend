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

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof FormType];
      if (value !== undefined && value !== null) {
        // Handle file separately
        if (key === 'photo' && value instanceof File) {
          formData.append(key, value);
        } 
        // Handle other fields
        else if (key !== 'photo' && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Ensure all required fields are included
    formData.append('resident', data.resident?.toString() || '');
    formData.append('unit', data.unit?.toString() || '');
    formData.append('type', data.type || '');
    formData.append('title', data.title || '');
    formData.append('description', data.description || '');
    
    return formData;
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = convertFormDataToMultipart(formData);
      await createNewInquiry(data, {'Content-Type': 'multipart/form-data'});
      
      // Reset form and navigate on success
      setFormData(initialFormData);
      setFormErrors(initialFormErrors);
      navigate({to:'/resident/inquiries'});
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally set error state for user feedback
    } finally {
      setIsSubmitting(false);
    }
  };

  const filter = useMemo(() => {
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