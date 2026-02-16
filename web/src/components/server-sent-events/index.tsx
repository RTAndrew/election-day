import { useEffect } from "react";
import { API_URL } from "../../utils/http";
import { queryClient } from "@/utils/query-client";
import { getWinningPartiesOptions } from "@/services/party";
import { getDistributedVotesPerPartyOptions } from "@/services/district";
import { useWithSound } from "@/hooks/useSound";
import mouseClickSound from "@/assets/mouse-click.mp3";

const ServerSentEvents = () => {
  const { playSound } = useWithSound(mouseClickSound);

  useEffect(() => {

		const url = `${API_URL}stream`;
		const eventSource = new EventSource(url);


		// eventSource.onopen = () => setState("open");
		// eventSource.onerror = () => setState("error");

    eventSource.onmessage = (e: MessageEvent<string>) => {
      queryClient.refetchQueries(getWinningPartiesOptions);
      queryClient.refetchQueries(getDistributedVotesPerPartyOptions(undefined));
      const {event} = JSON.parse(e.data);
			if (event === "votesUpdated") {
				playSound();
			}

		};

		return () => {
			eventSource.close();
		};
	}, []);

	return <></>;
};

export default ServerSentEvents;
