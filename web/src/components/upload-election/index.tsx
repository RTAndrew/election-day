import { Button } from "antd";
import UploadElectionModal from "./upload-election-modal";
import { useState } from "react";

const UploadElectionButton = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Button type="primary" onClick={() => setIsModalOpen(true)}>Upload Election</Button>
			<UploadElectionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</>
	);
};

export default UploadElectionButton;
