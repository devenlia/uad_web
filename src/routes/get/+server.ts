import type { RequestHandler } from './$types';
import { fetchRequest, getBackendUrl } from '$lib/utils.server';

const getData = (params: URLSearchParams) => {
	const type = params.get('type');
	const id = params.get('id') ?? params.get('path');

	return { type, id };
};

export const GET: RequestHandler = async ({ url }) => {
	const data = getData(url.searchParams);

	let getUrl: string;
	if (data.type == 'search') getUrl = getBackendUrl() + `/content/page/search?path=${data.id}`;
	else getUrl = getBackendUrl() + `/content/${data.type}/get?id=${data.id}`;

	return new Response(JSON.stringify(await fetchRequest(fetch, getUrl, 'GET')));
};
