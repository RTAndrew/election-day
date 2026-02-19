import { type PropsWithChildren } from 'react'

import { Layout } from "antd";
import styles from "./styles.module.css";
import { Link } from '@tanstack/react-router';
import UploadElectionButton from "../../components/upload-election";
const { Header, Footer, Content } = Layout;


const MainLayout = ({ children }: PropsWithChildren) => {
  return (
		<Layout>
			<Header className={[styles.header, styles.globalPadding].join(" ")}>
				<Link to="/">
					<p className={styles.logo}>Election Day</p>
				</Link>

				<ul className={styles.menu}>
					<li>
						<Link to="/">Overview</Link>
					</li>
					<li>
						<Link to="/districts">Districts</Link>
					</li>
					<li>
						<UploadElectionButton />
					</li>
				</ul>
			</Header>
			<Content className={styles.globalPadding}>{children}</Content>
			<Footer>
				<center>
					Made with ❤️ by{" "}
					<a
						href="https://github.com/RTAndrew"
						target="_blank"
						rel="noopener noreferrer"
					>
						RTAndrew
					</a>
				</center>
			</Footer>
		</Layout>
	);
}

export default MainLayout