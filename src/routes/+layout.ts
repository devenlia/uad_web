import type { LayoutLoad } from './$types';

export const trailingSlash = 'never';

export const load: LayoutLoad = async ({ url }) => {
	return {
		type: url.searchParams.get('type')
	};
};
