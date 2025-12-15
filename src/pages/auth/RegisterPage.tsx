import AuthLayout from "../../layouts/auth/AuthLayout.tsx";
import {useNavigate} from "react-router-dom";
import {z} from "zod";
import {UserPlus} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "../../hooks/useAuth.ts";
import type {createUser} from "../../types/User.ts";

const registerSchema = z.object({
    username: z.string().min(8, "Username must be at least 8 characters").max(100),

    email: z.email("Invalid email address"),

    birthday:z.string().refine((val) => !!Date.parse(val), "Invalid date"),

    password: z.string().min(8, "Password must be at least 8 characters")
        .max(40)
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/,
            "Password must contain upper, lower, number, and special character"),

    confirmPassword: z.string().min(8, "Required field").max(40),

    weight: z.number().min(10, "Weight must be at least 10kg").max(500).optional(),

    height: z.number().min(10, "Height must be at least 10cm").max(300).optional(),
}).superRefine((data, ctx) =>{
    if(data.password !== data.confirmPassword) {
        ctx.addIssue({
                message: "Passwords do not match",
                path: ["confirmPassword"],
                code: "custom"
            }
        )
    }
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage:React.FC = ()=> {
    const {register: registerMutation} = useAuth();
    const navigate = useNavigate();

    const {register, handleSubmit, formState:{errors, isSubmitting}}= useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });


    const onSubmit = (data: RegisterForm) => {
        const payload: createUser = {
            name: data.username,
            email: data.email,
            birthday: data.birthday.toString().split("T")[0],
            weightInKg: data.weight ?? 1,
            heightIncm: data.height ?? 1,
            password: data.password
        };

        registerMutation.mutate(
            payload,{
                onSuccess:() => {
                    navigate('/login');
                },
                onError: (error) => {
                    alert(error.message || "Failed to register");
                }
            }
        )
    }

    return (
        <AuthLayout
            title={"Register"}
        subTitle={"Your journey starts here!"}
        icon={<UserPlus size={32}/>}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <input {...register("username")} placeholder="Name"
                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                <input {...register("email")} type={"email"} placeholder="Email address"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}

                <input {...register("birthday")} type={"date"} placeholder="Birthday"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {errors.birthday && <p className="text-red-600">{errors.birthday.message}</p>}

                <input type={"password"} {...register("password")} placeholder="Password"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {errors.password && <p className="text-red-600">{errors.password.message}</p>}

                <input {...register("confirmPassword")} type={"password"}  placeholder="Confirm password"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}

                <input  {...register("weight", { valueAsNumber: true })} type="number" min={10} max={500} placeholder="Weight (optional)"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {errors.weight && <p className="text-red-600">{errors.weight.message}</p>}

                <input  {...register("height", { valueAsNumber: true })} type="number" min={10} max={300}  placeholder="Height (optional)"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                {errors.height && <p className="text-red-600">{errors.height.message}</p>}

                <button type="submit" disabled={isSubmitting}
                        className="bg-blue-500 text-white p-3 rounded text-lg hover:bg-blue-700 transition duration-500 ease-in-out disabled:opacity-50">
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </form>
        </AuthLayout>
    );
}

export default RegisterPage;