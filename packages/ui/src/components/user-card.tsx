import { User } from "..";
import { Button } from "./ui/button";

interface UserCardProps {
    user: User;
    userRemovalFunction: (user: User) => void;
    isUserTheCurrentUser: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, userRemovalFunction, isUserTheCurrentUser }) => {
    return (
        <div className='m-2 bg-slate-100 py-4 px-6 rounded-lg flex flex-col justify-start items-start gap-2'>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>User ID: </span>
                <span className='text-sm'>{user.id}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>First Name: </span>
                <span>{user.first_name}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>Last Name: </span>
                <span>{user.last_name}</span>
            </div>
            <div className='flex justify-between items-center w-full'>
                <span className='font-righteous'>Email: </span>
                <span>{user.email}</span>
            </div>
            {!isUserTheCurrentUser && <Button
                onClick={() => userRemovalFunction(user)}
                className="text-white bg-red-500 hover:bg-red-600 h-fit"
            >
                Remove From Org
            </Button>}
            {/* Add more fields as needed */}
        </div>
    );
};
