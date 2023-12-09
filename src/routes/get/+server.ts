// Copyright (C) 2023 Jannis Machowetz
import type { RequestHandler } from './$types';
import { fetchRequest, getBackendUrl } from '$lib/utils.server';
import { JSDOM } from 'jsdom';
import ColorThief from 'pure-color-thief-node'
import icoToPng from 'ico-to-png';
import type { RGB } from '$lib/types';

const getData = (params: URLSearchParams) => {
	const type = params.get('type');
	const id = params.get('id') ?? params.get('path') ?? '0';

	return { type, id };
};

const fetchFavicon = async (fetch : any, rawUrl: string) => {
	try {
		let formattedUrl = new URL(rawUrl);
		let url = formattedUrl.protocol + "//" + formattedUrl.hostname;
		if (formattedUrl.port)
			url = url + ':' + formattedUrl.port

		// Try to fetch the favicon at `${url}/favicon.ico` first
		let iconResponse = await fetch(`${url}/favicon.ico`);
		let iconBuffer;

		// If the response is ok, the favicon exists at the expected url
		if (iconResponse.ok) {
			const iconText = await iconResponse.arrayBuffer();
			iconBuffer = Buffer.from(iconText);
		} else {
			// If the response was not ok, fetch the html and look for the favicon url
			const pageResponse = await fetch(url);
			const html = await pageResponse.text();
			const dom = new JSDOM(html).window.document;
			const iconLink = dom.querySelector("link[rel='shortcut icon']") || dom.querySelector("link[rel='icon']");

			if (iconLink) {
				const iconUrl = new URL(iconLink.getAttribute('href') as string, url);
				iconResponse = await fetch(iconUrl);

				const iconText = await iconResponse.arrayBuffer();
				iconBuffer = Buffer.from(iconText);
			} else {
				return { favicon: "none", color: "none"};
			}
		}

		const colorThief = new ColorThief();
		await colorThief.loadImage(await icoToPng(iconBuffer, 128), 'image/png')
		const color : RGB = colorThief.getColorPalette(5)[0]

		const faviconBase64 = iconBuffer.toString('base64');

		return { favicon: faviconBase64, color};
	} catch (err) {
		console.error('An error occurred:', err);
	}
}

export const GET: RequestHandler = async ({ url, fetch }) => {
	const data = getData(url.searchParams);

	let getUrl: string;
	if (data.type == 'favicon') {
		return new Response(JSON.stringify(await fetchFavicon(fetch, data.id)), { status: 200 });
	}
	if (data.type == 'search') getUrl = getBackendUrl() + `/content/page/search?path=${data.id}`;
	else if (data.type == 'list') getUrl = getBackendUrl() + `/content/page/list`;
	else getUrl = getBackendUrl() + `/content/${data.type}/get?id=${data.id}`;

	let res = await fetchRequest(fetch, getUrl, 'GET');

	if (res.status != 200) return new Response(await res.text(), { status: res.status });
	else return new Response(JSON.stringify(await res.json()), { status: res.status });
};
