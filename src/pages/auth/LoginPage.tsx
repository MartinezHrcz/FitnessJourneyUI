import AuthLayout from "../../layouts/auth/AuthLayout.tsx";
import {LogIn} from "lucide-react";
import {useAuth} from "../../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import type {authRequest} from "../../types/Auth.ts";
import axios from "axios";

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage:React.FC = () => {
    const {login: loginMutation} = useAuth();
    const navigate = useNavigate();

    const {register, handleSubmit, formState:{errors, isSubmitting}}= useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginForm) => {
        const payload: authRequest ={
            username: data.username,
            password: data.password,
        }
        axios.post("http://localhost:9090/api/auth/login", {
            username: "herczegmartinez",
            password: "Aa1234567!"
        }).then(res => console.log(res.data))
            .catch(err => console.error(err.response));
        /*
        loginMutation.mutate(
            payload,{
                onSuccess:(response) => {
                    const data = response.data;
                    localStorage.setItem("token", data.token);
                    console.log(response.data);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    navigate('/dashboard');
                },
                onError: (error) => {
                    alert(error.message || "Failed to login");
                }
            }
        )*/
    }

    return (
        <AuthLayout title={"Sign in"}
                    subTitle={"Good to see you back!"} icon={<LogIn size={32}/>}>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                    <input {...register("username")} placeholder="Your username"
                           className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                    <input {...register("password")} type="password" placeholder="Password"
                           className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                    <button type="submit" disabled={isSubmitting}
                            className="bg-blue-500 text-white p-3 rounded text-lg hover:bg-blue-700 transition duration-500 ease-in-out disabled:opacity-50">
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}

export default LoginPage;