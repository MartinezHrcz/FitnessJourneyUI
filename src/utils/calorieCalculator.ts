import type { user } from "../types/User.ts";

export const calculateDailyCalories = (userData: user): number => {
    const birthDate = new Date(userData.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const weight = userData.weightInKg;
    const height = userData.heightInCm;

    const bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);

    const dailyCalories = Math.round(bmr * 1.55);

    return Math.max(dailyCalories, 1500);
};

export const getCalorieGoal = (userData: user | null): number => {
    if (!userData) return 2500;

    if (userData.preferredCalories && userData.preferredCalories > 0) {
        return userData.preferredCalories;
    }

    return calculateDailyCalories(userData);
};
