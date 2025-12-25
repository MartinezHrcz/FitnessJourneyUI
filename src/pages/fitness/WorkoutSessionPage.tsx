import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {user} from "../../types/User.ts";
import {useEffect, useState} from "react";
import ActiveWorkoutSession from "../../components/ActiveWorkoutSession.tsx";
import {useParams} from "react-router-dom";
import {workoutApi} from "../../api/workouts/workoutApi.ts";
import type {WorkoutDTO} from "../../types/fitness/Workout.ts";
import FinishedWorkoutSession from "../../components/FinishedWorkoutSession.tsx";

const WorkoutSessionPage = () => {
    const {id} = useParams<{ id: string }>();
    const [user, setUser] = useState<user | null>(null);
    const [workout, setWorkout] = useState<WorkoutDTO | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    useEffect(() => {
        if (id) {
            workoutApi.getById(id).then((workout) => {
                setWorkout(workout.data)
            })
        }
    }, [id]);

    if (!workout) return <div className="p-8 text-center">Loading session...</div>;

    return (
        <MainDashboardLayout user={user} title={"Workout"} activePath={"workouts"}>
            {workout?.status === 'ONGOING' ?
                <ActiveWorkoutSession workout={workout} setWorkout={setWorkout} /> : <FinishedWorkoutSession workout={workout} />
            }
        </MainDashboardLayout>)
}

export default WorkoutSessionPage;