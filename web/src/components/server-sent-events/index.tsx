import { useEffect } from "react";
import { API_URL } from "../../utils/http";
import { queryClient } from "@/utils/query-client";
import { useWithSound } from "@/hooks/useSound";
import mouseClickSound from "@/assets/mouse-click.mp3";
import { useUploadProgress } from "../context/upload-progress";

const ServerSentEvents = () => {
	const { playSound } = useWithSound(mouseClickSound);
	const { addProgress } = useUploadProgress();

	useEffect(() => {
		const url = `${API_URL}stream`;
		const eventSource = new EventSource(url);

		// eventSource.onopen = () => setState("open");
		// eventSource.onerror = () => setState("error");

		eventSource.onmessage = (e: MessageEvent<string>) => {
			const parsedEvent = JSON.parse(e.data);

			if (parsedEvent.event === "uploadProgress") {
				addProgress(parsedEvent.uploadId, {
					status: parsedEvent?.data?.status,
					phase: parsedEvent?.phase,
					color: "blue",
					icon: undefined,
					content: "",
					data: parsedEvent?.data,
				});
			}

			if (parsedEvent.event === "votesUpdated") {
				playSound();
				// refetch all queries
				queryClient.invalidateQueries();
			}
		};

		return () => {
			eventSource.close();
		};
	}, []);

	return <></>;
};

export default ServerSentEvents;
