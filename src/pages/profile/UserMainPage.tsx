import {useEffect, useState} from "react";
import type {userDTO} from "../../types/User.ts";
import UserDashboardLayout from "../../layouts/user/UserDashboardLayout.tsx";

const UserMainPage:React.FC = () =>{

    const [user,setUser]=useState<userDTO | null>(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as userDTO);
        }
    }, [])

    return (
        <UserDashboardLayout user={user}>
            <h1>POST FEED WILL BE HERE</h1>
        </UserDashboardLayout>
    );
}

export default UserMainPage;