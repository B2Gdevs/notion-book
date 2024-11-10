import { useSession } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Cog } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'ui';

interface CorpAdminCompanyAcctDropdownProps {
	onOrgChange?: (orgId: string) => void;
}

const CorpAdminCompanyAcctDropdown = ({ onOrgChange }: CorpAdminCompanyAcctDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOrgClick = (orgId: string) => {
		setIsOpen(false);
		onOrgChange?.(orgId);
	};

	const sess = useSession();
	const orgMemberships = sess.session?.user?.organizationMemberships;
	const orgsMemsAdminOf = orgMemberships?.filter(
		(orgMembership) =>
			orgMembership.role === 'admin'
	);

	const orgAccountRoutes = [
		...(orgsMemsAdminOf
			?.map((orgMem) => orgMem.organization)
			?.map((org) => ({
				path: `/accounts/${org?.id}/admin`,
				boldName: `${org?.name}`,
				label: 'Settings',
			})) ?? []),
	];

	if (!(orgAccountRoutes.length > 0)) {
		return null;
	}

	return (
		<div className='relative flex flex-col gap-4'>
			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				className='relative'
			>
				<Button
					onClick={() => setIsOpen(!isOpen)}
					className='bg-primary-off-white p-4 rounded-md w-full text-center text-primary-spinach-green font-righteous lg:text-xl hover:text-secondary-peach-orange'
				>
					Company Account
				</Button>
			</motion.div>

			{isOpen && (
				<div className='absolute top-full mt-2 left-0 w-full'>
					{orgAccountRoutes?.map((route) => (
						<Link href={route.path} key={route.path}>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								// these should jiggle every 5 seconds
								animate={{ rotate: 360 }}
								className='group bg-primary-spinach-green text-white shadow-2xl p-2 lg:p-4 rounded-md w-full text-center text-xs lg:text-base flex justify-between items-center my-2'
								onClick={() => handleOrgClick(route.path.split('/')[2])} // Extract orgId from the path
							>
								<span className='text-primary-off-white group-hover:text-secondary-peach-orange'>
									{route.boldName}
								</span>
								<Cog />
							</motion.div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default CorpAdminCompanyAcctDropdown;
