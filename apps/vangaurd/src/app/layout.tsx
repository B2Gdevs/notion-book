import '@fontsource/righteous';
import '@fontsource/open-sans/500.css';

import { ClerkProvider } from '@clerk/nextjs';
import { IntercomProviderWithClient, Toaster, TooltipProvider } from 'ui';
import ReactQueryProvider from '../providers/react-query-provider';
import { CSPostHogProvider } from '../providers/posthog-provider';

export const metadata = {
	title: 'Colorfull.ai',
};

const clerk_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider publishableKey={clerk_key}>
			<html lang='en' data-theme="default">
				<body className='bg-primary-off-white'>
					<Toaster />
					<CSPostHogProvider>
					<TooltipProvider>
						<ReactQueryProvider>
							<IntercomProviderWithClient >
								{children}
							</IntercomProviderWithClient>
						</ReactQueryProvider>
					</TooltipProvider>
					</CSPostHogProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
