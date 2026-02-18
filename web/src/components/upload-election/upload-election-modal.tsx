import { uploadElection } from "@/services/upload-election";
import { InboxOutlined } from "@ant-design/icons";

import { Modal } from "antd";
import { Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import { useState } from "react";
import UploadStatus from "./upload-status";
const { Dragger } = Upload;


interface UploadElectionModalProps {
	open: boolean;
	onClose: () => void;
}

export interface IFileUpload {
	file: RcFile;
	uploadId: string;
	errorMessage?: string;
}

const UploadElectionModal = ({ open, onClose }: UploadElectionModalProps) => {
	const [file, setFile] = useState<IFileUpload | null>(null);

	const handleUpload = async (file: RcFile) => {

			const uploadId = crypto.randomUUID();
			setFile({ file, uploadId });

    const { error } = await uploadElection(file, uploadId);
		if (error) {
			setFile((prev) => {
				if (!prev) return null;

				return {
					...prev,
					errorMessage: error as string,
				};
			});
		}

		return false;
	};

  const handleClose = () => {
		setFile(null);
		onClose();
	};

	return (
		<Modal
			open={open}
			footer={false}
			destroyOnHidden
			closable={true}
			onCancel={handleClose}
			title="Upload Election"
			mask={{
				closable: file ? false : true,
			}}
			cancelText={"Close"}
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

			{file && <UploadStatus file={file} />}
		</Modal>
	);
};

export default UploadElectionModal;
