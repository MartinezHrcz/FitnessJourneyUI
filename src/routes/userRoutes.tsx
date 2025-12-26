import UserMainPage from "../pages/profile/UserMainPage.tsx";
import UserProfilePage from "../pages/profile/UserProfilePage.tsx";

export const userRoutes = [
    {path: "/dashboard", element: <UserMainPage /> },
    {path: "/profile", element: <UserProfilePage />}
]