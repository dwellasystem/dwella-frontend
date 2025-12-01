import { createFileRoute, useNavigate } from '@tanstack/react-router'
import EditProfile from '../../../../../pages/employee/EditProfile';
import type { User } from '../../../../../models/User.model';
import { useEffect, useState } from 'react';
import { useGetUser } from '../../../../../hooks/user/useGetUser';
import { useUpdateUser } from '../../../../../hooks/user/useUpdateUser';

export const Route = createFileRoute('/_protected/admin/employee/$employeeId/edit')({
  component: RouteComponent,
})

const initialData: User = {
    first_name: "",
    last_name: "",
    middle_name: "",
    email:"",
    phone_number: "",
    address: "",
}

function RouteComponent() {
  const {employeeId} = Route.useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<User>(initialData);
  
  const {error, loading, user:fetchedUser} = useGetUser(employeeId);

  useEffect(() => {
    if (fetchedUser) {
      setData({
        first_name: fetchedUser.first_name || "",
        last_name: fetchedUser.last_name || "",
        middle_name: fetchedUser.middle_name || "",
        email: fetchedUser.email || "",
        phone_number: fetchedUser.phone_number || "",
        address: fetchedUser.address || "",
      });
    }
  }, [fetchedUser]);

  if(error) return error;
  if(loading) return <div>Loading...</div>;

  const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Assuming useUpdateUser is a hook that updates the user data
      const response = await useUpdateUser(employeeId, data);
      console.log(response)
      navigate({to:'/admin/employee'});
    } catch (error) {
            console.error(error)
    }
  }

  const cancelEdit = () => {
    navigate({to:'/admin/employee'})
  };

  if(!Number(employeeId)){
    navigate({to:'/admin/employee'});
    return null;
  }
      
  return <EditProfile data={data} cancelEdit={cancelEdit} updateProfile={updateProfile} setData={setData}/>
}
