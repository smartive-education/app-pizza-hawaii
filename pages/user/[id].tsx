import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Header } from '../../components/Header';

import { Image, ImageOverlay, UserProfile, Headline } from '@smartive-education/pizza-hawaii';
import User from '../../data/user.json';
console.log('user', User);
type Props = {
	mumble: {
		id: string;
	};
};

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
	return {
		props: {
			mumble: { id },
		},
	};
};

export default function UserPage({ mumble }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const user = { ...User };
	const changeBackgroundImage = () => {
		console.log('changeBackgroundImage Logic here');
	};

	return (
		<div className="bg-slate-100 relative mb-6">
			<Header user={user} />
			<h1>User Page of Mumble Dude {mumble.id}</h1>
			<ImageOverlay
				preset="edit"
				buttonLabel={'change Background banner image'}
				onClick={() => {
					changeBackgroundImage;
				}}
			>
				<Image src="//picsum.photos/seed/1400/1428/" alt="static alt image" preset="header" />
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
			<Headline level={3}>{user.userName}</Headline>
		</div>
	);
}
