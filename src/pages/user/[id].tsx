import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { TPost, TUser } from '../../types';
import { UserCardModel } from '../../models/UserCard';
import { services } from '../../services';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
	UserProfile,
	Image,
	Card,
	Headline,
	UserName,
	IconLink,
	TimeStamp,
	Richtext,
	Button,
	Grid,
} from '@smartive-education/pizza-hawaii';
import MainLayout from '../../components/MainLayout';
import Head from 'next/head';

type Props = {
	user: {
		userData: TUser;
		posts: TPost;
	};
};

export default function UserPage(props: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState(undefined);
	const [isLoadingPosts, setIsLoadingPosts] = useState(false);
	const [userPosts, setUserPosts] = useState([]);
	const router = useRouter();
	const { data: session } = useSession();
	const userId = router.query.id?.toString();
	// console.log('%c[id].tsx line:39 posts', 'color: white; background-color: #007acc;', userPosts);
	useEffect(() => {
		const fetchData = async () => {
			const userData = await services.users.getUserById({ id: userId, accessToken: session?.accessToken });
			setUserData({ user: userData });
			setIsLoading(false);
		};
		fetchData();
	}, [session, userId]);

	useEffect(() => {
		if (userId) {
			const fetchUserPosts = async (userId: string) => {
				const userPosts = await services.posts.searchPostbyQuerry({ userId });
				console.log('%c[id].tsx line:50 userPosts', 'color: white; background-color: #007acc;', userPosts);
				setUserPosts({ posts: userPosts?.data });
				setIsLoadingPosts(false);
			};
			fetchUserPosts();
		}
	}, [userData]);
	/*
	const loadUserData = async (userId: string) => {
		const res = await services.users.getUserById({ id: userId, accessToken: session?.accessToken });
	};
*/
	const searchPostsofUser = async (userId: string) => {
		const userPosts = await services.posts.searchPostbyQuerry({ userId });
		console.log('userPosts', userPosts);
	};

	// TODO: probably somewhere else as a helperClass
	const unfollowUser = (id: string) => {
		console.log('unfollow user with user id', id);
	};

	return isLoading && !userData ? (
		<span>loading Data... - a loading animation would be nice- </span>
	) : (
		<MainLayout>
			<>
				<Head>
					<title>Details about User {userData?.user?.firstName}</title>
				</Head>
			</>
			<div className="relative mb-6">
				<Image
					className="max-height: h-80"
					src={userData?.user.backgroundImage}
					alt={userData?.user?.userName}
					preset="header"
				/>
				<div className="absolute right-8 bottom-0 translate-y-1/2 z-10">
					<UserProfile
						userName={userData?.user?.userName}
						avatar={userData?.user?.avatarUrl}
						size="XL"
						border={true}
						href="/"
						buttonLabel={userData?.user?.userName}
					/>
				</div>
			</div>
			<div className="mb-2 text-slate-900 pr-48">
				<Headline level={3}>
					{userData?.user?.firstName} {userData?.user.lastName}
				</Headline>
			</div>
			<span className="flex flex-row align-baseline gap-3 mb-3">
				<UserName href={userData.user.profileLink}>{userData.user.userName}</UserName>

				<IconLink as="span" icon="location" colorScheme="slate" size="S">
					CityName
				</IconLink>

				<IconLink as="span" icon="calendar" colorScheme="slate" size="S">
					<TimeStamp date={userData.user.createdAt} prefix="Mitglied seit" />
				</IconLink>
			</span>
			<div className="text-slate-400 mb-8">
				<Richtext size="M">{userData.user.bio}</Richtext>
			</div>
			<div className="text-right flex flex-row max-w-[50%]">
				<span>
					Du folgst {userData.user.firstName} {userData.user.lastName}{' '}
				</span>
				<Button
					onClick={() => unfollowUser(userData.user.id)}
					as="button"
					size="S"
					colorScheme="slate"
					icon="cancel"
				>
					Unfollow
				</Button>
			</div>
			<br />
			<Button as="button" size="L" onClick={() => searchPostsofUser(userData.user.id)}>
				Search Mumble posts of {userData.user.firstName}
			</Button>
			here should come all mumble-posts replies of that user by search querry.
			<Grid variant="col" gap="M" as="div">
				{userPosts && userPosts.posts.map((post) => (
					<h3>Hi there! {post.id}</h3>
				))}
				<div>
				</div>
			</Grid>
		</MainLayout>
	);
}
