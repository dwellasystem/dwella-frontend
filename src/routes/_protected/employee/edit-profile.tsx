import { createFileRoute, useNavigate } from '@tanstack/react-router'
import EditProfile from '../../../pages/employee/EditProfile'
import { useAuth } from '../../../contexts/auth/AuthContext';
import { useEffect, useState } from 'react';
import { useGetUser } from '../../../hooks/user/useGetUser';
import type { User } from '../../../models/User.model';
import { useUpdateUser } from '../../../hooks/user/useUpdateUser';

export const Route = createFileRoute('/_protected/employee/edit-profile')({
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
  const {user, setUser} = useAuth();
  const [data, setData] = useState(initialData);

  const navigate = useNavigate();

  const {error, loading, user:fetchedUser} = useGetUser(user?.id!);
  
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
      const updatedData = await useUpdateUser(user?.id, data);
      setUser((prev) => ({...prev,
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        middle_name: updatedData.middle_name,
        email: updatedData.email,
        phone_number: updatedData.phone_number,
        address: updatedData.address,
      }));
    } catch (error) {
      console.log(error)
    }
    navigate({to:'/employee/profile'});
  }

  const cancelEdit = () => {
    navigate({to:'/employee/profile'});
  };

  return <EditProfile data={data!} cancelEdit={cancelEdit} setData={setData} updateProfile={updateProfile}/>
}
