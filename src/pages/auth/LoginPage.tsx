import AuthLayout from "../../layouts/auth/AuthLayout.tsx";
import {LogIn} from "lucide-react";
import {useAuth} from "../../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import type {authRequest} from "../../types/Auth.ts";

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage:React.FC = () => {
    const {login: loginMutation} = useAuth();
    const navigate = useNavigate();

    const {register, handleSubmit, formState:{isSubmitting}}= useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginForm) => {
        const payload: authRequest ={
            username: data.username,
            password: data.password,
        }
        loginMutation.mutate(
            payload,{
                onSuccess:(response) => {
                    const data = response.data;
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    console.log(response.data);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    navigate('/dashboard');
                },
                onError: (error) => {
                    alert(error.message || "Failed to login");
                }
            }
        )
    }

    return (
        <AuthLayout title={"Sign in"}
                    subTitle={"Good to see you back!"}
                    icon={<LogIn size={32} className="text-blue-500 dark:text-blue-400" />}>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                    <input {...register("username")} placeholder="Your username"
                                                     className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-colors"/>

                    <input {...register("password")} type="password" placeholder="Password"
                           className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-colors"/>

                    <button type="submit" disabled={isSubmitting}
                            className="bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-xl text-lg font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50 mt-2 shadow-lg shadow-blue-500/20">
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}

export default LoginPage;