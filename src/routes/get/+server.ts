// Copyright (C) 2023 Jannis Machowetz
import type { RequestHandler } from './$types';
import { fetchRequest, getBackendUrl } from '$lib/utils.server';
import { json } from '@sveltejs/kit';

const getData = (params: URLSearchParams) => {
	const type = params.get('type');
	const id = params.get('id') ?? params.get('path') ?? '0';

	return { type, id };
};

export const GET: RequestHandler = async ({ url }) => {
	const data = getData(url.searchParams);

	let getUrl: string;
	if (data.type == 'search') getUrl = getBackendUrl() + `/content/page/search?path=${data.id}`;
	else if (data.type == 'list') getUrl = getBackendUrl() + `/content/page/list`;
	else getUrl = getBackendUrl() + `/content/${data.type}/get?id=${data.id}`;

	let res = await fetchRequest(fetch, getUrl, 'GET');

	if (res.status != 200) return new Response(await res.text(), { status: res.status });
	else return new Response(JSON.stringify(await res.json()), { status: res.status });
};
