import AuthLayout from "../../layouts/auth/AuthLayout.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {z} from "zod";
import {UserPlus} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";


const registerSchema = z.object({
    username: z.string().min(8, "Username must be at least 8 characters").max(100),
    email: z.email(),
    birthday:  z.date(),
    password: z.string().min(8, "Password must be at least 8 characters")
        .max(40)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])$/,
            "Password must contain upper, lower case, and a number and a special"),
    confirmPassword: z.string().min(8, "Confirm password is required").max(40),
    weight: z.number().min(10, "Weight must be at least 10kg").max(500),
    height: z.number().min(10, "Height must be at least 10cm").max(300),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage = ():React.FC => {

    const navigate = useNavigate();
    const {register, handleSubmit, formState:{errors, isSubmitting}}= useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = (data: RegisterForm) => {
        
    }

    return (
        <AuthLayout
            title={"Register"}
        subTitle={"Start your journey here!"}
        icon={<UserPlus size={32}/>}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <input type="text" placeholder="Name"
                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="text" placeholder="Email address"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="text" placeholder="Birthday"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="text" placeholder="Password"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="text" placeholder="Confirm password"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="text" placeholder="Weight"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <input type="text" placeholder="Height"
                       className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                <button type="submit" disabled={isSubmitting}
                className="bg-blue-500 text-white p-3 rounded text-lg hover:bg-blue-700 transition duration-500 ease-in-out disabled:opacity-50">
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </form>
        </AuthLayout>
    );
}

export default RegisterPage;