import CaloriesMainPage from "../pages/diet/CaloriesMainPage.tsx";
import CaloriesHistoryPage from "../pages/diet/CaloriesHistoryPage.tsx";
import DayDetailPage from "../pages/diet/DayDetailPage.tsx";

export const dietRoutes = [
    {path: '/calories', element: <CaloriesMainPage />},
    {path: '/calories/history', element: <CaloriesHistoryPage />},
    {path: '/calories/day/:date', element: <DayDetailPage />}
]