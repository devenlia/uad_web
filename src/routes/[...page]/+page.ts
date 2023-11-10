import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Page } from '$lib/types';
import { getBackendUrl } from '$lib/utils';

export const load: PageLoad = async ({ params, fetch }) => {
	let res: Response;

	if (params.page == '' || params.page.toLowerCase() == 'home') {
		res = await fetch(getBackendUrl() + `/content/page/home`);
	} else {
		let path = params.page
			.replace(/^\/|\/$/g, '')
			.split('/')
			.join('.')
			.toLowerCase()
			.replace(/\u00fc/g, 'ue')
			.replace(/\u00f6/g, 'oe')
			.replace(/\u00e4/g, 'ae')
			.replace(/\u00df/g, 'ss');
		res = await fetch(getBackendUrl() + `/content/page/search?path=${path}`);
	}

	if (res.status != 200) {
		throw error(res.status);
	} else {
		const page: Promise<Page> = await res.json();

		return {
			basePath: '/' + params.page.toLowerCase() + '/',
			page: page
		};
	}
};
