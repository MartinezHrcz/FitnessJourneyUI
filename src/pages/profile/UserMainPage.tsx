import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";

const UserMainPage:React.FC = () =>{

    const [user,setUser]=useState<user | null>(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    return (
        <MainDashboardLayout user={user} title={"Dashboard"} activePath={"/dashboard"}  >
            <h1>POST FEED WILL BE HERE</h1>
        </MainDashboardLayout>
    );
}

export default UserMainPage;