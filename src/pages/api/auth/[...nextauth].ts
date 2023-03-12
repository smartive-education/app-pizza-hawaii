import NextAuth, { NextAuthOptions } from 'next-auth';
import ZitadelProvider from 'next-auth/providers/zitadel';

import { services } from '../../../services';
import { TUser } from '../../../types';

export const authOptions: NextAuthOptions = {
	providers: [
		ZitadelProvider({
			issuer: process.env.ZITADEL_ISSUER as string,
			clientId: process.env.ZITADEL_CLIENT_ID as string,
			clientSecret: process.env.ZITADEL_CLIENT_SECRET as string,
			async profile(zitadelProfile, { access_token }): Promise<TUser> {
				if (!access_token) throw new Error('No access token found');

				const user = (await services.users.getUserById({
					id: zitadelProfile.sub,
					accessToken: access_token,
				})) as TUser;
				return {
					...user,
					email: zitadelProfile.email,
				};
			},
			client: {
				token_endpoint_auth_method: 'none',
			},
		}),
	],
	session: {
		maxAge: 12 * 60 * 60, // 12 hours
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.expiresAt = (account.expires_at as number) * 1000;
			}
			if (user) {
				token.user = user as TUser;
			}

			if (Date.now() > (token.expiresAt as number)) {
				delete token.accessToken;
			}

			return token;
		},
		async session({ session, token }) {
			session.user = token.user as TUser;
			session.accessToken = token.accessToken;
			return session;
		},
	},

	pages: {
		signIn: '/auth/login',
		signOut: '/auth/logout',
		error: '/auth/error', // Error code passed in query string as ?error=
		newUser: '/auth/register', // New users will be directed here on first sign in (leave the property out if not of interest)
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
