import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNotices } from "../../../../../hooks/notices/useNotices";
import { useEffect, useState, type FormEvent } from "react";
import CreateNotice from "../../../../../pages/employee/CreateNotice";
import { useNoticeType } from "../../../../../hooks/notices/useNoticeType";
import { useGetAssignedUnits } from "../../../../../hooks/assigned-unit/useGetAssignedUnits";

export const Route = createFileRoute(
  "/_protected/employee/notices/$noticeId/edit"
)({
  component: RouteComponent,
  loader: ({ params }) => params.noticeId,
});

interface initialFormDataType {
  title: string;
  content: string;
  target_audience: number[] | undefined;
  notice_type: undefined | number;
}

function RouteComponent() {
  const [formData, setFormData] = useState<initialFormDataType>({
    title: "",
    content: "",
    target_audience: [],
    notice_type: undefined,
  });

  const { noticeId } = Route.useParams();
  const navigate = useNavigate();

  const { getNotice, notice, loading, updateNotice } = useNotices();
  // const { units } = useGetUnits();
  const {units} = useGetAssignedUnits();
  const {noticeTypes} = useNoticeType();

  if (!Number(noticeId)) {
    navigate({ to: "/employee/notices" });
  }

  const allChecked = (formData.target_audience?.length ?? 0) === 0;

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (
        (!allChecked && formData?.target_audience?.length === 0) ||
        !formData?.content ||
        !formData?.title ||
        !formData?.notice_type
      ) {
        return alert("Select Audience Required");
      }
      updateNotice(Number(noticeId), formData);
      return navigate({to:'/employee/notices'});
    } catch (error) {
      console.log(error);
    }
  };

  const handleAllChange = () => {
    if (allChecked) {
      // currently ALL → uncheck all
      setFormData((prev) => ({ ...prev, target_audience: [] }));
    } else {
      // selecting ALL → empty array
      setFormData((prev) => ({ ...prev, target_audience: [] }));
    }
  };

  const handleUnitChange = (id: number) => {
    if (allChecked) {
      // all was checked → start specific selection
      setFormData((prev) => ({ ...prev, target_audience: [id] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        target_audience: prev.target_audience?.includes(id)
          ? prev.target_audience.filter((x) => x !== id)
          : [...(prev.target_audience ?? []), id],
      }));
    }
  };

  useEffect(() => {
    if (!notice) {
      getNotice(Number(noticeId));
    }
    if (notice) {
      setFormData({
        title: notice.title,
        content: notice.content,
        target_audience: notice.target_audience
          ? notice.target_audience.map((unit: any) => unit.id)
          : [],
        notice_type: notice.notice_type.id,
      });
    }
  }, [notice]);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <CreateNotice
      noticeTypes={noticeTypes}
      handleAllChange={handleAllChange}
      handleUnitChange={handleUnitChange}
      setFormData={setFormData}
      allChecked={allChecked} // ✅ now derived
      formData={formData}
      navigateTo={() => navigate({ to: "/employee/notices" })}
      submitForm={submitForm}
      units={units as any}
      title="Save Changes"
    />
  );
}

