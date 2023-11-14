import type { RequestHandler } from './$types';
import { fetchRequest, getBackendUrl } from '$lib/utils.server';

const getData = (data: FormData) => {
	const type = data.get('type');
	const id = data.get('id') ?? data.get('path');

	return { type, id };
};

export const GET: RequestHandler = async ({ request }) => {
	const data = getData(await request.formData());

	let url : string;
	if (data.type == "search")
		url = getBackendUrl() + `/content/page/search?path=${data.id}`;
	else
		url = getBackendUrl() + `/content/${data.type}/get?id=${data.id}`;

	return await fetchRequest(fetch, url, 'GET');
};