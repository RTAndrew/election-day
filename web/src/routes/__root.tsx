import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import MainLayout from '@/layouts/main-layout'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/utils/query-client'
import ServerSentEvents from "@/components/server-sent-events";
import UploadProgressProvider from "@/components/context/upload-progress";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Election Day",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<UploadProgressProvider>
					<MainLayout>
						<QueryClientProvider client={queryClient}>
							<ServerSentEvents />

							{children}
						</QueryClientProvider>
					</MainLayout>
				</UploadProgressProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
