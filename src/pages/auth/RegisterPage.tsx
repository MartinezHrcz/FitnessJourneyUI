import AuthLayout from "../../layouts/auth/AuthLayout.tsx";
import {useNavigate} from "react-router-dom";
import {z} from "zod";
import {Eye, EyeOff, UserPlus} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "../../hooks/useAuth.ts";
import type {createUser} from "../../types/User.ts";
import {useEffect, useState} from "react";
import {Alert} from "../../components/AlertDialog.tsx";
import {authApi} from "../../api/auth/authApi.ts";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;

const getPasswordStrength = (password: string): { score: number; label: string; colorClass: string; widthClass: string } => {
    if (!password) {
        return {
            score: 0,
            label: "",
            colorClass: "bg-gray-300 dark:bg-slate-600",
            widthClass: "w-0",
        };
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[#?!@$%^&*-]/.test(password)) score += 1;

    if (score <= 2) {
        return { score, label: "Weak", colorClass: "bg-red-500", widthClass: "w-1/3" };
    }

    if (score <= 4) {
        return { score, label: "Medium", colorClass: "bg-amber-500", widthClass: "w-2/3" };
    }

    return { score, label: "Strong", colorClass: "bg-emerald-500", widthClass: "w-full" };
};

const requiredNumber = (fieldName: string, min: number, max: number, unit: string) =>
    z.number().superRefine((value, ctx) => {
        if (Number.isNaN(value)) {
            ctx.addIssue({
                code: "custom",
                message: `${fieldName} is required`,
            });
            return;
        }

        if (value < min) {
            ctx.addIssue({
                code: "custom",
                message: `${fieldName} must be at least ${min}${unit}`,
            });
        }

        if (value > max) {
            ctx.addIssue({
                code: "custom",
                message: `${fieldName} must be at most ${max}${unit}`,
            });
        }
    });

const registerSchema = z.object({
    username: z.string().min(8, "Username must be at least 8 characters").max(100),

    email: z.email("Invalid email address"),

    birthday: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Use format YYYY-MM-DD")
        .refine((val) => !!Date.parse(val), "Invalid date"),

    password: z.string().min(8, "Password must be at least 8 characters")
        .max(40)
        .regex(strongPasswordRegex,
            "Password must contain upper, lower, number, and special character"),

    confirmPassword: z.string().min(8, "Required field").max(40),

    weight: requiredNumber("Weight", 10, 500, "kg"),

    height: requiredNumber("Height", 10, 300, "cm"),
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
type UsernameAvailabilityStatus = "idle" | "checking" | "available" | "taken" | "error";

const RegisterPage:React.FC = ()=> {
    const {register: registerMutation} = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [usernameAvailability, setUsernameAvailability] = useState<UsernameAvailabilityStatus>("idle");
    const [checkedUsername, setCheckedUsername] = useState("");

    const {register, setValue, setError, clearErrors, handleSubmit, watch, formState:{errors, isSubmitting}}= useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const usernameValue = watch("username") ?? "";
    const normalizedUsername = usernameValue.trim();
    const passwordValue = watch("password") ?? "";
    const isWeakPassword = passwordValue.length > 0 && !strongPasswordRegex.test(passwordValue);
    const passwordStrength = getPasswordStrength(passwordValue);

    useEffect(() => {
        if (!normalizedUsername || normalizedUsername.length < 8) {
            setUsernameAvailability("idle");
            setCheckedUsername("");
            if (errors.username?.type === "manual") {
                clearErrors("username");
            }
            return;
        }

        let isCancelled = false;
        setUsernameAvailability("checking");

        const timeout = window.setTimeout(async () => {
            try {
                const response = await authApi.usernameAvailable(normalizedUsername);
                if (isCancelled) {
                    return;
                }

                const available = response.data.available;
                setCheckedUsername(response.data.username);

                if (available) {
                    setUsernameAvailability("available");
                    if (errors.username?.type === "manual") {
                        clearErrors("username");
                    }
                    return;
                }

                setUsernameAvailability("taken");
                setError("username", {
                    type: "manual",
                    message: "Username is already taken"
                });
            } catch {
                if (isCancelled) {
                    return;
                }

                setUsernameAvailability("error");
            }
        }, 450);

        return () => {
            isCancelled = true;
            window.clearTimeout(timeout);
        };
    }, [normalizedUsername, clearErrors, setError, errors.username?.type]);

    const handleBirthdayInput = (rawValue: string) => {
        const cleaned = rawValue.replace(/[^0-9-]/g, "");
        const parts = cleaned.split("-");
        if (parts.length > 0) {
            parts[0] = (parts[0] || "").slice(0, 4);
        }

        const normalized = parts
            .map((part, index) => {
                if (index === 0) return part;
                return part.slice(0, 2);
            })
            .join("-");

        setValue("birthday", normalized, { shouldValidate: true, shouldDirty: true });
    };


    const onSubmit = (data: RegisterForm) => {
        if (normalizedUsername.length < 8) {
            setError("username", {
                type: "manual",
                message: "Username must be at least 8 characters"
            });
            return;
        }

        if (usernameAvailability !== "available" || checkedUsername !== normalizedUsername) {
            setError("username", {
                type: "manual",
                message: "Please choose an available username"
            });
            return;
        }

        const payload: createUser = {
            name: normalizedUsername,
            email: data.email,
            birthday: data.birthday.toString().split("T")[0],
            weightInKg: data.weight ?? 1,
            heightInCm: data.height ?? 1,
            password: data.password
        };

        registerMutation.mutate(
            payload,{
                onSuccess:() => {
                    navigate('/login');
                },
                onError: (error) => {
                    setErrorMessage(error.message || "Failed to register");
                }
            }
        )
    }

    const inputClasses = "w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-slate-500";

    return (
        <AuthLayout
            title={"Register"}
            subTitle={"Your journey starts here!"}
            icon={<UserPlus size={32}/>}>
            <Alert
                message={errorMessage}
                type="error"
                onClose={() => setErrorMessage(undefined)}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <input {...register("username")} placeholder="Name"
                 className={inputClasses}/>
                {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                {!errors.username && usernameAvailability === "checking" && (
                    <p className="text-sm text-gray-500 dark:text-slate-400">Checking username availability...</p>
                )}
                {!errors.username && usernameAvailability === "available" && checkedUsername === normalizedUsername && (
                    <p className="text-sm text-emerald-600">Username is available</p>
                )}
                {!errors.username && usernameAvailability === "error" && (
                    <p className="text-sm text-amber-600">Could not validate username right now. You can try again.</p>
                )}

                <input {...register("email")} type={"email"} placeholder="Email address"
                       className={inputClasses}/>
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}

                <input
                    {...register("birthday")}
                    type={"date"}
                    placeholder="Birthday"
                    min="1900-01-01"
                    max={new Date().toISOString().split("T")[0]}
                    onInput={(e) => handleBirthdayInput((e.target as HTMLInputElement).value)}
                    className={inputClasses}
                />
                {errors.birthday && <p className="text-red-600">{errors.birthday.message}</p>}

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Password"
                        className={`${inputClasses} pr-10`}
                    />
                    <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.colorClass} ${passwordStrength.widthClass}`}
                        />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                        Password strength{passwordStrength.label ? `: ${passwordStrength.label}` : ""}
                    </p>
                </div>
                {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                {!errors.password && isWeakPassword && (
                    <p className="text-amber-600">
                        Password is weak. Use upper and lower case letters, at least one number, and one special character.
                    </p>
                )}

                <div className="relative">
                    <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className={`${inputClasses} pr-10`}
                    />
                    <button
                        type="button"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}

                   <input  {...register("weight", { valueAsNumber: true })} type="number" min={10} max={500} placeholder="Weight (kg)"
                       className={inputClasses}/>
                {errors.weight && <p className="text-red-600">{errors.weight.message}</p>}

                   <input  {...register("height", { valueAsNumber: true })} type="number" min={10} max={300}  placeholder="Height (cm)"
                       className={inputClasses}/>
                {errors.height && <p className="text-red-600">{errors.height.message}</p>}

                <button type="submit" disabled={isSubmitting || usernameAvailability === "checking"}
                        className="bg-blue-500 text-white p-3 rounded text-lg hover:bg-blue-700 transition duration-500 ease-in-out disabled:opacity-50">
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </form>
        </AuthLayout>
    );
}

export default RegisterPage;