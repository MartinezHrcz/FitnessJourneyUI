import CaloriesMainPage from "../pages/diet/CaloriesMainPage.tsx";
import CaloriesHistoryPage from "../pages/diet/CaloriesHistoryPage.tsx";

export const dietRoutes = [
    {path: '/calories', element: <CaloriesMainPage />},
    {path: '/calories/history', element: <CaloriesHistoryPage />}
]