import { DollarSign, User } from "lucide-react";
import { CodeBlock, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, Share } from "ui";

interface GuestUserButtonProps {
    share: Share
}

export const GuestUserButton: React.FC<GuestUserButtonProps> = ({ share }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex justify-center items-center space-x-2 bg-primary-off-white rounded-full p-2 shadow-md">
                    <div className="w-8 h-8 rounded-full font-righteous bg-white flex justify-center items-center">
                        G
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="bg-primary-off-white border-primary-almost-black border rounded-md shadow-lg"
                style={{ boxShadow: '0 4px 6px -1px rgba(67, 90, 111, 0.47), 0 2px 4px -1px rgba(67, 90, 111, 0.3), inset 0 0 10px rgba(42, 167, 137, 0.25)' }}>
                <DropdownMenuItem
                    className="flex m-0 p-0  justify-between space-x-2"
                    disabled={true}>
                    <div className="flex items-center">
                        <User size={16} />
                        <DropdownMenuLabel>Name: </DropdownMenuLabel>
                    </div>
                    <CodeBlock>Guest</CodeBlock>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={`flex m-0 p-0  justify-between space-x-2 ${(share.budget ?? 0) > 0 ? 'text-primary-cucumber-green' : ''}`}
                    disabled={true}>
                    <div className="flex items-center">
                        <DollarSign size={16} />
                        <DropdownMenuLabel>Stipend: </DropdownMenuLabel>
                    </div>
                    <span>${share.budget}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}