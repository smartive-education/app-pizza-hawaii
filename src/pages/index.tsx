import { GetServerSideProps, InferGetStaticPropsType, InferGetServerSidePropsType } from 'next';

import { Header } from '../components/Header';
import { ContentCard } from '../components/ContentCard';
import { ContentInput } from '../components/ContentInput';

import { Headline, Grid } from '@smartive-education/pizza-hawaii';
import { useState } from 'react';

import User from './../data/user.json';
// static data
import { Post as PostType } from '../types/Post';
// dynamic qwacker
import { fetchMumbles, Mumble } from '../services/qwacker';

export default function PageHome(): InferGetServerSidePropsType<typeof getServerSideProps> {
	// use state hooks for loading
	const [mumbles, setMumbles] = useState([]);
	const [loading, setLoading] = useState(true);
	console.log('mumbles at start', mumbles);

	const user = {
		...User,
		profileLink: `user/${User.userName}`,
	};

	const loadMoreMumbles = async () => {
		const { mumbles: newMumbles } = await fetchMumbles({
			limit: 12,
			offset: 0,
		});
		setMumbles([...mumbles, ...newMumbles]);
		console.log('new mumbles arrives', newMumbles);
		setLoading(false);
	};

	// const Posts = posts.data;

	return (
		<div className="bg-slate-100">
			<Header user={user} />
			<main className="px-content">
				<button onClick={() => loadMoreMumbles()} className="text-violet-600 bg-pink-400 rounded py-3">
					Load Moar Mumbles
				</button>
				<section className="mx-auto w-full max-w-content">
					<div className="mb-2 text-violet-600">
						<Headline level={2}>Welcome to Storybook</Headline>
					</div>

					<div className="text-slate-500 mb-8">
						<Headline level={4} as="p">
							Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
						</Headline>
					</div>

					<Grid variant="col" gap="M" marginBelow="M">
						<ContentInput
							variant="newPost"
							headline="Hey, was geht ab?"
							author={user}
							placeHolderText="Deine Meinung zählt"
						/>
						<ul>
							{!loading &&
								mumbles.map((mumble) => (
									<>
									<ContentCard key={mumble.id} variant="timeline" post={mumble} />
										<li>
											test output:<br />
											id: {mumble.id} <br />
											text: {mumble.text} <br />
											likeCounter: {mumble.likeCount}
										</li>
									</>
								))}
						</ul>
						{/* {Posts && 
							// Posts.sort((a: PostType, b: PostType) => {
								// return new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1;
							// }).map((post) => {
								// return <ContentCard key={post.id} variant="timeline" post={post} />;
							// })}
						*/}
					</Grid>
				</section>
			</main>
		</div>
	);
}
export const getServerSideProps: GetServerSideProps = async () => ({
	props: { posts: require('../data/posts.json') },
});
