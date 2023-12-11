// Copyright (C) 2023 Jannis Machowetz
import type { RequestHandler } from './$types';
import { fetchRequest, getBackendUrl } from '$lib/utils.server';
import { JSDOM } from 'jsdom';
import ColorThief from 'pure-color-thief-node'
import icoToPng from 'ico-to-png';
import type { RGB } from '$lib/types';
import * as url from 'url';

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

		let iconResponse = await fetch(`${url}/favicon.ico`);
		let iconBuffer;
		let contentType;

		if (iconResponse.ok && iconResponse.headers.get('Content-Type').includes('image')) {
			contentType = iconResponse.headers.get('Content-Type')
			iconBuffer = Buffer.from(await iconResponse.arrayBuffer());
		} else {
			const pageResponse = await fetch(url);
			const html = await pageResponse.text();
			const dom = new JSDOM(html).window.document;
			const iconLink = dom.querySelector("link[rel='shortcut icon']") || dom.querySelector("link[rel='icon']");

			if (iconLink) {
				const iconUrl = new URL(iconLink.getAttribute('href') as string, url);
				iconResponse = await fetch(iconUrl);

				contentType = iconResponse.headers.get('Content-Type')
				iconBuffer = Buffer.from(await iconResponse.arrayBuffer());
			} else {
				return { favicon: "none", color: "none"};
			}
		}
		let icon;

		switch (contentType) {
			case 'image/x-icon':
				icon = await icoToPng(iconBuffer, 128)
				break
			case 'image/png':
				icon = iconBuffer
				break
			default:
				throw Error("Unsupported image format")
		}

		const colorThief = new ColorThief();
		await colorThief.loadImage(icon, 'image/png')
		const color : RGB = colorThief.getColorPalette(5)[0]

		const faviconBase64 = iconBuffer.toString('base64');

		return { favicon: faviconBase64, color};
	} catch (err) {
		console.error(`An error occurred: \n ${rawUrl} \n`, err);
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
