import { type PropsWithChildren } from 'react'

import { Button, Layout } from "antd";
import styles from "./styles.module.css";
import { Link } from '@tanstack/react-router';
const { Header, Footer, Content } = Layout;


const MainLayout = ({ children }: PropsWithChildren) => {
  return (
		<Layout>
			<Header className={styles.header}>
				<p className={styles.logo}>
					Election Day
				</p>

				<ul className={styles.menu}>
					<li>
						<Link to="/">
							Overview
						</Link>
					</li>
					<li>
						<Link to="/districts">
							Districts
						</Link>
					</li>
					<li>
						<Link to="/results">
							Results
						</Link>
					</li>
					<li>
						<Button type='primary'>
							Upload Results
						</Button>
					</li>
				</ul>
			</Header>
			<Content className={styles.content}>{children}</Content>
			<Footer>Footer</Footer>
		</Layout>
	);
}

export default MainLayout