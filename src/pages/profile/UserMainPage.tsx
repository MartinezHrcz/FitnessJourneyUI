import {useEffect, useState} from "react";
import type {userDTO} from "../../types/User.ts";

const UserMainPage:React.FC = () =>{

    const [user,setUser]=useState<userDTO | null>(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as userDTO);
        }
    })

    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>Email: {user?.email}</p>
            <p>ID: {user?.id}</p>
        </div>
    );
}

export default UserMainPage;