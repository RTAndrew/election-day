import { Typography } from "antd";
import styles from "./styles.module.css";
interface ScreenHeaderProps {
	title: string;
}

const ScreenHeader = ({ title }: ScreenHeaderProps) => {
	return <Typography.Title level={1} className={styles.title}>{title}</Typography.Title>;
};

export default ScreenHeader;
