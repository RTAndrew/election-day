import React, {
	createContext,
	useCallback,
	useContext,
	useState,
	type PropsWithChildren,
} from "react";

export type TUploadStats = "insert_vote" | "parsing_file" | "completed";

export interface IStatusItem {
	data?: any;
	color: string;
	content: string;
	icon: React.ReactNode;
	phase: `${TUploadStats}`;
	status: "pending" | "loading" | "completed";
}

export type TUploadProgress = {
	[uploadId: string]: IStatusItem[];
};

type UploadProgressContextType = {
	progress: TUploadProgress;
	addProgress: (uploadId: string, data: IStatusItem) => void;
	getProgress: (uploadId: string) => IStatusItem[] | undefined;
};

const UploadProgressContext = createContext<UploadProgressContextType>({
	progress: {},
	addProgress: () => {},
	getProgress: () => [],
});

export const useUploadProgress = () => {
	const context = useContext(UploadProgressContext);

	if (!context) {
		throw new Error(
			"useUploadProgress must be used within a UploadProgressProvider",
		);
	}

	return context;
};

const DEFAULT_STATUS_ITEMS: IStatusItem[] = [
	{
		color: "blue",
		icon: undefined,
		content: "Parsing elections",
		phase: "parsing_file",
		status: "pending",
	},
	{
		color: "blue",
		icon: undefined,
		content: "Processing election",
		phase: "insert_vote",
		status: "pending",
	},
	{
		color: "blue",
		icon: undefined,
		content: "Calculating results",
		phase: "completed",
		status: "pending",
	},
];

const UploadProgressProvider = ({ children }: PropsWithChildren) => {
	const [progress, setProgress] = useState<TUploadProgress>({});

	const addProgress = useCallback((uploadId: string, data: IStatusItem) => {
		setProgress((prev) => {
			const copy = { ...prev };
			const exists = copy?.[uploadId] ?? DEFAULT_STATUS_ITEMS;

			const existingItem = exists.find((item) => item.phase === data.phase);
			if (!existingItem) {
				return {
					...prev,
					[uploadId]: [data],
				};
			}

			return {
				...prev,
				[uploadId]: exists.map((item) => {
					if (item.phase === data.phase) {
						return { ...item, ...data };
					}
					return item;
				}),
			};
		});
	}, []);

  const getProgress = useCallback(
		(uploadId: string) => {
			return progress?.[uploadId] ?? undefined;
		},
		[progress],
	);

	return (
		<>
			<UploadProgressContext.Provider
				value={{ progress, addProgress, getProgress }}
			>
				{children}
			</UploadProgressContext.Provider>
		</>
	);
};

export default UploadProgressProvider;
