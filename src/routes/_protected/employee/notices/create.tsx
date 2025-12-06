import { createFileRoute, useNavigate } from "@tanstack/react-router";
import CreateNotice from "../../../../pages/employee/CreateNotice";
import { useState, type FormEvent } from "react";
// import { useGetUnits } from "../../../../hooks/unit/useGetUnits";
import { useNotices } from "../../../../hooks/notices/useNotices";
import { useNoticeType } from "../../../../hooks/notices/useNoticeType";
// import { useGetAssignedUnits } from "../../../../hooks/assigned-unit/useGetAssignedUnits";
import { useAssignedUnitOptions } from "../../../../hooks/assigned-unit/useAssignedUnitOptions";

interface initialFormDataType {
  title: string;
  content: string;
  target_audience: number[] | undefined;
  notice_type: undefined | number;
}

const initialFormData: initialFormDataType = {
  title: "",
  content: "",
  target_audience: [],
  notice_type: 1,
};

export const Route = createFileRoute("/_protected/employee/notices/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState(initialFormData);
  const [allChecked, setAllChecked] = useState(false);

  // const { units } = useGetUnits();
  const {units: assignedUnit} = useAssignedUnitOptions();
  const { createNewNotice } = useNotices();
  const { noticeTypes } = useNoticeType();

  const navigate = useNavigate();
  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (
        (allChecked === false && formData.target_audience?.length === 0) ||
        !formData.content ||
        !formData.title ||
        !formData.notice_type
      ) {
        return alert("Select Audience Required");
      }

      console.log(formData)
      createNewNotice(formData);
      return navigate({ to: "/employee/notices" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAllChange = () => {
    if (allChecked) {
      // Uncheck all
      setAllChecked(false);
      setFormData((prev) => ({ ...prev, target_audience: [] }));
    } else {
      // Check all → targetAudience empty means ALL
      setAllChecked(true);
      setFormData((prev) => ({ ...prev, target_audience: [] }));
    }
  };

  const navigateTo = () => navigate({ to: "/employee/notices" });

  // handle individual checkbox
  const handleUnitChange = (id: number) => {
    if (allChecked) {
      // if previously all was checked, switch to specific selection
      setAllChecked(false);
      setFormData((prev) => ({ ...prev, target_audience: [id] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        target_audience: prev.target_audience?.includes(id)
          ? prev.target_audience.filter((x) => x !== id) // remove id
          : [...(prev.target_audience ?? []), id], // add id
      }));
    }
  };
  return (
    <CreateNotice
      noticeTypes={noticeTypes}
      handleAllChange={handleAllChange}
      handleUnitChange={handleUnitChange}
      setFormData={setFormData}
      allChecked={allChecked}
      formData={formData}
      navigateTo={navigateTo}
      submitForm={submitForm}
      units={assignedUnit as any}
      title="Create"
    />
  );
}
