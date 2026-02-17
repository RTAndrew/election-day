import { uploadElection } from "@/services/upload-election";
import { InboxOutlined } from "@ant-design/icons";

import { Flex, Modal, Typography } from "antd";
import { Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import { useState } from "react";
const { Dragger } = Upload;

import styles from "./styles.module.css";

interface UploadElectionModalProps {
	open: boolean;
	onClose: () => void;
}

const UploadElectionModal = ({ open, onClose }: UploadElectionModalProps) => {
	const [file, setFile] = useState<RcFile | null>(null);

	const handleUpload = async (file: RcFile) => {
		setFile(file);
		// const result = await uploadElection(file);
		return false;
	};

	return (
		<Modal
			open={open}
			footer={false}
			destroyOnHidden
			closable={false}
			onCancel={onClose}
			title="Upload Election"
		>
			<Dragger
				name="election-file"
				multiple={false}
				accept={{ format: ".txt, .csv" }}
				showUploadList={false}
				beforeUpload={(file) => handleUpload(file)}
			>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">
					Click or drag file to this area to upload
				</p>
				<p className="ant-upload-hint">Only .txt and .csv files are allowed.</p>
			</Dragger>

			{file && (
				<div className={styles.fileRoot}>
					<div className={styles.fileDescription}>
						<Typography.Paragraph strong>File: </Typography.Paragraph>
						<Typography.Paragraph>{file.name}</Typography.Paragraph>
					</div>
					<div className={styles.fileDescription}>
						<Typography.Paragraph strong>Size: </Typography.Paragraph>
						<Typography.Paragraph>{file.size}</Typography.Paragraph>
					</div>
					<div className={styles.fileDescription}>
						<Typography.Paragraph strong>Type: </Typography.Paragraph>
						<Typography.Paragraph>{file.size}</Typography.Paragraph>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default UploadElectionModal;
