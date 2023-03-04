import { TPost } from '../types';

export const postModel = (userPosts) => {
	if (userPosts) return null;

	userPosts.map((post: TPost) => {
		return {
			id: post?.id || '',
			creator: post.creator || '',
			text: post.text || '',
			type: post.type || '',
			likeCount: post.likeCount || 0,
			replyCount: post.replyCount || 0,
			likedByUser: post.likedByUser || false,
			mediaType: post.mediaType || null,
			mediaUrl: post.mediaUrl || '',
			parentId: post.parentId || '',
			createdAt: new Date().toISOString(),
		};
	});
};
