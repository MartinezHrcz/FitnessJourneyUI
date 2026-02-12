export interface FoodItemDTO {
    id: string;
    name: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    isDefault: boolean;
    nutritionSummary?: string;
}

export interface FoodItemCreateDTO {
    name: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface MealEntryResponseDTO {
    id: string;
    foodName: string;
    quantity: number;
    unit: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
}

export interface MealEntryCreateDTO {
    foodItemId: string;
    quantity: number;
}

export interface CalorieLogDTO {
    id: string;
    date: string;
    entries: MealEntryResponseDTO[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
}