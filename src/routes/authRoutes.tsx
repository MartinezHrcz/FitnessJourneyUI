import RegisterPage from "../pages/auth/RegisterPage.tsx";
import LoginPage from "../pages/auth/LoginPage.tsx";

export const authRoutes= [
    {
        path:'/login',
        element: <LoginPage />
    },
    {
        path:'/register',
        element: <RegisterPage />
    }
]