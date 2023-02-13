import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Header } from '../../components/Header';

import { Image, ImageOverlay, UserProfile, Headline } from '@smartive-education/pizza-hawaii';
import User from '../../data/user.json';

type Props = {
	profile: {
		alias: string;
	};
};

export default function ProfilePage({ profile }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const user = { ...User };
	const changeBackgroundImage = () => {
		console.log('changeBackgroundImage Logic here');
	};

	return (
		<div className="bg-slate-100 relative mb-6">
			<Header user={user} />
			<h1>Edit your own Profile Page of: {profile.alias}</h1>
			{/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
			<ImageOverlay
				preset="edit"
				buttonLabel={'change Background banner image'}
				onClick={() => {
					changeBackgroundImage;
				}}
			>
				<Image src="//picsum.photos/seed/johndoe1/1600/1157/" alt="static alt image" preset="header" />
			</ImageOverlay>
			<div className="absolute right-8 bottom-0 translate-y-1/2 z-10">
				<UserProfile
					userName={user.userName}
					avatar={user.avatarUrl}
					size="XL"
					border={true}
					href="/"
					buttonLabel="Change Avatar"
				/>
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query: { alias } }) => {
	return {
		props: {
			profile: { alias },
		},
	};
};
