import SummaryCardReport from "@/components/summary-card-report";
import { Skeleton } from "antd";

import styles from "./styles.module.css";

export const SummaryCardsSkeleton = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
		<SummaryCardReport title="Votes">
			<div className={styles.stat}>
				<Skeleton.Node
					active
					className={styles.skeletonStatValue}
					style={{ width: "4rem", height: "1.5rem" }}
				>
					{" "}
				</Skeleton.Node>
				<Skeleton.Node
					active
					className={styles.skeletonStatLabel}
					style={{ width: "6rem", height: "0.8rem", marginTop: "0.25rem" }}
				>
					{" "}
				</Skeleton.Node>
			</div>
		</SummaryCardReport>

		<SummaryCardReport title="Winning Party">
			<Skeleton.Node
				active
				className={styles.skeletonPartyName}
				style={{ width: "10rem", height: "1.5rem", margin: "0 auto 0.5rem" }}
			>
				{" "}
			</Skeleton.Node>
			<div className={styles.statList}>
				<div className={styles.stat}>
					<Skeleton.Node
						active
						style={{ width: "4rem", height: "1.5rem" }}
					>
						{" "}
					</Skeleton.Node>
					<Skeleton.Node
						active
						style={{ width: "4rem", height: "0.8rem", marginTop: "0.25rem" }}
					>
						{" "}
					</Skeleton.Node>
				</div>
				<div className={styles.stat}>
					<Skeleton.Node
						active
						style={{ width: "3rem", height: "1.5rem" }}
					>
						{" "}
					</Skeleton.Node>
					<Skeleton.Node
						active
						style={{ width: "4rem", height: "0.8rem", marginTop: "0.25rem" }}
					>
						{" "}
					</Skeleton.Node>
				</div>
			</div>
		</SummaryCardReport>
	</div>
);
