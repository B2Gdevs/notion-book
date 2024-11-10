import { BudgetSchedule, Org } from "..";

export function isBudgetScheduleAppliedForDay(day: number, org: Org): boolean;
export function isBudgetScheduleAppliedForDay(date: Date, org: Org): boolean;
export function isBudgetScheduleAppliedForDay(dayOrDate: number | Date, org: Org): boolean {
    const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = typeof dayOrDate === 'number' ? dayOrDate : dayOrDate.getDay();
    const dayName = dayMapping[day] as keyof BudgetSchedule;
    return org && org.budget_schedule && dayName in org.budget_schedule ? org.budget_schedule[dayName] : false;
}

export function getBudgetAmountForDay(date: Date, org: Org): number | null {

    if (isBudgetScheduleAppliedForDay(date, org)) {
        return org?.budget?.amount ?? 0;
    }
    return null;
}