import { useSession } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Cog } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'ui';

interface FloatingButtonGroupProps {
	onOrgChange?: (orgId: string) => void;
}

const FloatingButtonGroup = ({ onOrgChange }: FloatingButtonGroupProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOrgClick = (orgId: string) => {
		setIsOpen(false);
		onOrgChange?.(orgId);
	};

	const sess = useSession();
	const orgMemberships = sess.session?.user?.organizationMemberships;
	const orgsMemsAdminOf = orgMemberships?.filter(
		(orgMembership) =>
			orgMembership.role === 'admin' &&
			sess.session?.user.primaryEmailAddress?.emailAddress.endsWith(
				'@colorfull.ai',
			),
	);

	const orgAccountRoutes = [
		...(orgsMemsAdminOf
			?.map((orgMem) => orgMem.organization)
			?.map((org) => ({
				path: `/accounts/${org?.id}/budgets`,
				boldName: `${org?.name}`,
				label: 'Settings',
			})) ?? []),
	];

	if (!(orgAccountRoutes.length > 0)) {
		return null;
	}

	return (
		<div className='fixed left-4 top-1/4 transform -translate-y-1/2 flex flex-col gap-4'>
			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				className='relative'
			>
				<Button
					onClick={() => setIsOpen(!isOpen)}
					className='bg-primary-off-white shadow-2xl p-4 rounded-md w-full text-center'
				>
					Go to Admin
				</Button>
			</motion.div>

			{isOpen && (
				<div className='grid gap-2 '>
					{orgAccountRoutes?.map((route) => (
						<Link href={route.path} key={route.path}>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								// these should jiggle every 5 seconds
								animate={{ rotate: 360 }}
								className='group bg-primary-spinach-green text-white shadow-2xl p-4 rounded-md w-full text-center flex justify-between'
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

export default FloatingButtonGroup;
