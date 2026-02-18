import { useMemo } from "react";
import styles from "./styles.module.css";
import { Alert, Timeline } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import {
	useUploadProgress,
	type IStatusItem,
} from "@/components/context/upload-progress";
import type { IFileUpload } from "../upload-election-modal";
import Loading from "@/components/loading";
interface UploadStatusProps {
	file: IFileUpload;
}

const truncateFileName = (name: string) => {
	if (name.length <= 19) return name;
	return `${name.slice(0, 10)}...${name.slice(-10)}`;
};

export const getStatusItemName = (item: IStatusItem) => {
	if (item.phase === "insert_vote") {
		if (!item.data) return "Processing votes";
		return `Processing votes (${item.data.current_row} of ${item.data.total_rows})`;
	}

	if (item.phase === "parsing_file") return "Parsing elections";

	return "Calculating results";
};

const UploadStatus = ({ file }: UploadStatusProps) => {
	const { getProgress } = useUploadProgress();
	const status = getProgress(file.uploadId);

	const statusItems = useMemo(() => {
		return (status ?? []).map((item) => {
			const isLoadingAndHasError =
				item.status === "loading" && file.errorMessage;

			return {
				...item,
				content: getStatusItemName(item),
				loading: file.errorMessage ? false : item.status === "loading",
				color: isLoadingAndHasError
					? "red"
					: item.status === "completed"
						? "green"
						: item.color,
				icon: item.status === "completed" ? <CheckCircleFilled /> : item.icon,
			} as IStatusItem;
		});
	}, [status, file]);

	return (
		<>
			<div className={styles.fileRoot}>
				<div className={styles.fileDescription}>
					<span>File: </span>
					<span>{truncateFileName(file.file.name)}</span>
				</div>
			</div>

			{file.errorMessage && (
				<Alert
					className={styles.errorMessage}
					title={file.errorMessage}
					type="error"
					showIcon
				/>
			)}

			<div className={styles.fileStatus}>
				{statusItems.length > 0 ? (
					<Timeline items={statusItems} />
				) : (
					!file.errorMessage && <Loading />
				)}
			</div>
		</>
	);
};

export default UploadStatus;
