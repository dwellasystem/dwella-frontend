import { createFileRoute, useNavigate } from "@tanstack/react-router";
import CreateInquiry from "../../../../pages/employee/CreateInquiry";
import { useGetUnits } from "../../../../hooks/unit/useGetUnits";
import { useGetUsers } from "../../../../hooks/user/useGetUsers";
import { useState, type FormEvent } from "react";
import { useInquiry } from "../../../../hooks/inquiries/useInquiry";

export const Route = createFileRoute("/_protected/employee/inquiries/create")({
  component: RouteComponent,
});

type FormType = {
  resident: number | undefined;
  unit: number | undefined;
  type: string;
  title: string;
  description: string;
};

const initialFormData: FormType = {
  resident: undefined,
  unit: undefined,
  type: "",
  title: "",
  description: "",
};

function RouteComponent() {
  const { units } = useGetUnits();
  const { usersAsOptions: users } = useGetUsers();
  const [formData, setFormData] = useState(initialFormData);

  const {createNewInquiry} = useInquiry();

  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate({to: path})
  };

  const formSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if(!formData.resident || !formData.title || !formData.description || !formData.type || !formData.unit){
      return console.error('Form fields are required');
    }

    createNewInquiry(formData);
    return navigateTo('/employee/inquiries')
  };

  return (
    <CreateInquiry
      units={units}
      users={users}
      formData={formData}
      formSubmit={formSubmit}
      setFormData={setFormData}
      navigateTo={navigateTo}
    />
  );
}
