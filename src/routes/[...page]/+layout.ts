// Copyright (C) 2023 Jannis Machowetz
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	let path = params.page;

	if (path.endsWith('/')) path = path.slice(0, -1);

	let breadcrumbs = path.split('/').map((name: string, index: number, array: Array<any>) => {
		return {
			name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
			href: '/' + array.slice(0, index + 1).join('/')
		};
	});

	let desiredBreadcrumbs = breadcrumbs.length <= 3 ? breadcrumbs : [breadcrumbs[0], ...breadcrumbs.slice(-3)];

	return {
		breadcrumbs: desiredBreadcrumbs,
		path: path.replaceAll(/\//g, '.')
	};
};
