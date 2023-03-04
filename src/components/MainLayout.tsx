import { ReactElement, FC } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Header } from './Header';
import { TUser } from '../types';

type TMainLayout = {
	children: ReactElement | JSX.Element;

};

export const MainLayout: FC<TMainLayout> = ({ children }) => {
	const { data: session } = useSession();
	const currentUser: TUser | undefined = session?.user;

	return (
		<>
			<Head>
				<link rel="icon" href="favicon.svg" />
			</Head>
			{currentUser && <Header user={currentUser} />}
			<div className="sm:w-7/12 px-s my-0 mx-auto">
				<div className="w-full sm:w-7/12 px-s my-0 mx-auto justify-center text-slate-200">{children}</div>
			</div>
		</>
	);
};

export default MainLayout;
