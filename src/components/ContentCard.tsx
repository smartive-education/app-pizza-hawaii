/* eslint-disable import/no-unresolved */
import React, { FC, useState } from 'react';

import {
	Image,
	Label,
	Grid,
	TimeStamp,
	Richtext,
	UserName,
	IconLink,
	ImageOverlay,
	InteractionButton,
	CopyToClipboardButton,
	UserContentCard,
	TUserContentCard,
} from '@smartive-education/pizza-hawaii';

import { TPost } from '../types';

import ProjectSettings from './../data/ProjectSettings.json';

import { postsService } from '../services/api/posts/';
/*
 * Type
 */

type TContentCard = {
	variant: 'detailpage' | 'timeline' | 'response';
	post: TPost;
	profileLink?: string;
};

type TContentCardvariantMap = {
	headlineSize: 'S' | 'M' | 'L' | 'XL';
	textSize: 'M' | 'L';
	avatarSize: TUserContentCard['avatarSize'];
	avatarVariant: TUserContentCard['avatarVariant'];
};

/*
 * Style
 */

const contentCardvariantMap: Record<TContentCard['variant'], TContentCardvariantMap> = {
	detailpage: {
		headlineSize: 'XL',
		textSize: 'L',
		avatarSize: 'M',
		avatarVariant: 'standalone',
	},
	timeline: {
		headlineSize: 'L',
		textSize: 'M',
		avatarSize: 'M',
		avatarVariant: 'standalone',
	},
	response: {
		headlineSize: 'M',
		textSize: 'M',
		avatarSize: 'S',
		avatarVariant: 'subcomponent',
	},
};

export const ContentCard: FC<TContentCard> = ({ variant, post }) => {
	const setting = contentCardvariantMap[variant] || contentCardvariantMap.detailpage;
	const replyCount = post?.replyCount || 0;

	// toggle Like/Dislike
	const [likedByUser, setLikedByUser] = useState(post.likedByUser);
	const [likeCount, setLikeCount] = useState(post.likeCount);

	// Like function
	const handleLike = async () => {
		if (likedByUser) {
			postsService.unlike({ id: post.id }).then(() => {
				setLikeCount(likeCount - 1);
			});
		} else {
			postsService.like({ id: post.id }).then(() => {
				setLikeCount(likeCount + 1);
			});
		}
		setLikedByUser(!likedByUser);
	};

	if (!post.creator || typeof post.creator === 'string') {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full">
				<p className="text-center">Something went wrong. Please try again later.</p>
			</div>
		);
	}

	const headerSlotContent = (
		<Grid variant="col" gap="S">
			<Label as="span" size={setting.headlineSize}>
				{`${post.creator.displayName}`}
			</Label>
			<Grid variant="row" gap="S">
				<UserName href={post.creator.profileLink}>{post.creator.userName}</UserName>
				<IconLink as="span" icon="calendar" colorScheme="slate" size="S">
					<TimeStamp date={post.createdAt} />
				</IconLink>
			</Grid>
		</Grid>
	);

	return (
		<UserContentCard
			headline={headerSlotContent}
			userProfile={{
				avatar: post.creator.avatarUrl,
				userName: post.creator.userName,
				href: post.creator.profileLink,
			}}
			avatarVariant={setting.avatarVariant}
			avatarSize={setting.avatarSize}
		>
			<Richtext size={setting.textSize}>{post.text}</Richtext>

			{post.mediaUrl && (
				<ImageOverlay
					preset="enlarge"
					buttonLabel="Open image in fullscreen"
					onClick={function (): void {
						throw new Error('Function not implemented.');
					}}
				>
					<Image
						width={ProjectSettings.images.post.width}
						height={
							(ProjectSettings.images.post.width / ProjectSettings.images.post.aspectRatio[0]) *
							ProjectSettings.images.post.aspectRatio[1]
						}
						src={post.mediaUrl}
						alt={`Image of ${post.creator.firstName} ${post.creator.lastName}`}
					/>
				</ImageOverlay>
			)}

			<Grid variant="row" gap="M" wrapBelowScreen="md">
				<InteractionButton
					as="a"
					href={`/mumble/${post.id}`}
					isActive={replyCount > 0}
					colorScheme="violet"
					buttonText={replyCount > 0 ? `${replyCount} Comments` : replyCount === 0 ? 'Comment' : '1 Comment'}
					iconName={replyCount > 0 ? 'comment_filled' : 'comment_fillable'}
					onClick={function (): void {
						// throw new Error('Function not implemented.');
					}}
				/>
				<InteractionButton
					as="button"
					type="button"
					isActive={likeCount > 0}
					colorScheme="pink"
					buttonText={likeCount > 0 ? `${likeCount} Likes` : likeCount === 0 ? 'Like' : '1 Like'}
					iconName={likedByUser ? 'heart_filled' : 'heart_fillable'}
					onClick={handleLike}
				/>

				<CopyToClipboardButton
					defaultButtonText="Copy Link"
					activeButtonText="Link copied"
					shareText={`${process.env.NEXTAUTH_URL}/mumble/${post.id}`}
				/>
			</Grid>
		</UserContentCard>
	);
};
