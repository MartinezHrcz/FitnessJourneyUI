import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";

const WorkoutMainPage = () => {

    const [user, setUser] = useState<user | null>(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    return (
        <MainDashboardLayout user={user} activePath={"/workouts"} title={"Your fitness starts here!"}>
            These will be workouts
        </MainDashboardLayout>
    );
}

export default WorkoutMainPage;