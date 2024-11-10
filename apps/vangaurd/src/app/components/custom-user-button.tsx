import { useClerk, useSession } from "@clerk/nextjs";
import { Building, DollarSign, LogOut, User, Settings, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { BudgetSchedule, CodeBlock, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, useGetCurrentColorfullUser, useGetCurrentUserColorfullOrg } from "ui";
import { GlobalState, useGlobalStore } from "../../stores/globalStore";

export const CustomUserButton = () => {
    const session = useSession();
    const clerkUser = session?.session?.user;
    const { signOut } = useClerk();
    const router = useRouter();

    const email = clerkUser?.primaryEmailAddress?.emailAddress;
    const { data: colorfulUser } = useGetCurrentColorfullUser();
    const { data: userOrg } = useGetCurrentUserColorfullOrg();
	const selectedDate = useGlobalStore((state: GlobalState) => state.selectedDate);

    const routes = [
        { name: 'Orders', href: `/my-account/my-orders`, icon: ShoppingCart },
        { name: 'Settings', href: `/my-account/my-settings`, icon: Settings },
    ];

    // Function to get the current day of the week
    const getSelectedDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[selectedDate.getDay()];
        return currentDay;
    }

    // Function to check if the org has a budget for the current day
    const getDailyStipend = () => {
        const currentDay = getSelectedDay() as keyof BudgetSchedule; // Type assertion here
        if (userOrg && userOrg.budget_schedule && currentDay in userOrg.budget_schedule) {
            return userOrg.budget_schedule[currentDay] ? userOrg.budget?.amount : 0;
        } else {
            return 0; // Default to 0 if the day is not defined in the schedule
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 bg-primary-off-white rounded-full p-2 shadow-md">
                    <img src={clerkUser?.imageUrl}
                        alt="User profile image"
                        className="w-8 h-8 rounded-full" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-primary-off-white border-primary-almost-black border rounded-md shadow-lg"
                style={{ boxShadow: '0 4px 6px -1px rgba(67, 90, 111, 0.47), 0 2px 4px -1px rgba(67, 90, 111, 0.3), inset 0 0 10px rgba(42, 167, 137, 0.25)' }}>
                {(colorfulUser?.amount_owed ?? 0) > 0 && (
                    <DropdownMenuItem className={`flex  items-center space-x-2 ${(colorfulUser?.amount_owed ?? 0) > 0 ? 'text-red-500' : ''}`} disabled={true}>
                        <div className="flex m-0 p-0 items-center">
                            <DollarSign size={16} />
                            <DropdownMenuLabel>Amount Owed: </DropdownMenuLabel>
                        </div>
                        <span>${colorfulUser?.amount_owed?.toFixed(2)}</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    className="flex m-0 p-0 justify-between space-x-2"
                    disabled={true}>
                    <div className="flex items-center">
                        <User size={16} />
                        <DropdownMenuLabel>Email: </DropdownMenuLabel>
                    </div>
                    <CodeBlock>{email}</CodeBlock>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex m-0 p-0 justify-between space-x-2"
                    disabled={true}>
                    <div className="flex  items-center">
                        <Building size={16} />
                        <DropdownMenuLabel>Organization: </DropdownMenuLabel>
                    </div>
                    <CodeBlock>{userOrg?.name}</CodeBlock>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={`flex m-0 p-0 justify-between space-x-2 ${((getDailyStipend() ?? 0) > 0) ? 'text-primary-cucumber-green' : ''}`}
                    disabled={true}>
                    <div className="flex px-0 items-center">
                        <DollarSign size={16} />
                        <DropdownMenuLabel>Daily Org Stipend: </DropdownMenuLabel>
                    </div>
                    <span>{getDailyStipend()}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-black" />
                {routes.map(route => (
                    <DropdownMenuItem
                        key={route.name}
                        className="flex px-0 items-center space-x-2 focus:cursor-pointer focus:bg-primary-cucumber-green focus:text-primary-off-white hover:rounded-md  hover:transition-all hover:duration-300"
                        onClick={() => router.push(route.href)}
                    >
                        <route.icon size={16} />
                        <span>{route.name}</span>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-black" />
                <DropdownMenuItem
                    className="flex px-0 items-center space-x-2 focus:cursor-pointer focus:bg-secondary-pink-salmon focus:text-primary-off-white"
                    onClick={() => signOut(() => router.push("/"))}>
                    <LogOut size={16} />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};