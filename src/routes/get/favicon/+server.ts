// Copyright (C) 2023 Jannis Machowetz
import { JSDOM } from 'jsdom';
import icoToPng from 'ico-to-png';
import ColorThief from 'pure-color-thief-node';
import type { RGB } from '$lib/types';
import type { RequestHandler } from './$types';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const faviconCacheDir = './cache/favicons';

const checkCached = (hostname: string) => {
	const cachePath = `${faviconCacheDir}/${hostname}.json`;

	if (existsSync(cachePath)) return JSON.parse(readFileSync(cachePath, 'utf8'));

	return null;
};

const cacheFavicon = (hostname: string, favicon: any) => {
	if (!existsSync(faviconCacheDir)) {
		mkdirSync(faviconCacheDir);
	}

	writeFileSync(`${faviconCacheDir}/${hostname}.json`, JSON.stringify(favicon));
};

const fetchFavicon = async (fetch: any, rawUrl: string) => {
	try {
		let formattedUrl = new URL(rawUrl);
		let hostname = formattedUrl.hostname + (formattedUrl.port ? '.' + formattedUrl.port : '');
		let url = formattedUrl.protocol + '//' + formattedUrl.hostname;
		if (formattedUrl.port) url = url + ':' + formattedUrl.port;

		const cachedFavicon = checkCached(hostname);
		if (cachedFavicon) return cachedFavicon;

		let iconResponse = await fetch(`${url}/favicon.ico`);
		let iconBuffer;
		let contentType;

		if (iconResponse.ok && iconResponse.headers.get('Content-Type')?.includes('image')) {
			contentType = iconResponse.headers.get('Content-Type');
			iconBuffer = Buffer.from(await iconResponse.arrayBuffer());
		} else {
			const pageResponse = await fetch(url);
			const html = await pageResponse.text();
			const dom = new JSDOM(html).window.document;
			const iconLink = dom.querySelector("link[rel='shortcut icon']") || dom.querySelector("link[rel='icon']");

			if (iconLink) {
				const iconUrl = new URL(iconLink.getAttribute('href') as string, url);
				iconResponse = await fetch(iconUrl);

				contentType = iconResponse.headers.get('Content-Type');
				iconBuffer = Buffer.from(await iconResponse.arrayBuffer());
			} else {
				return { errorMessage: 'No favicon found for URL!', status: 404 };
			}
		}
		let icon;

		switch (contentType) {
			case 'image/x-icon':
			case 'image/vnd.microsoft.icon':
				icon = await icoToPng(iconBuffer, 128);
				break;
			case 'image/png':
				icon = iconBuffer;
				break;
			default:
				throw Error(`Unsupported image format \'${contentType}\'`);
		}

		const colorThief = new ColorThief();
		await colorThief.loadImage(icon, 'image/png');
		const color: RGB = colorThief.getColor();

		const faviconBase64 = iconBuffer.toString('base64');

		cacheFavicon(hostname, { favicon: faviconBase64, color });
		return { favicon: faviconBase64, color };
	} catch (err) {
		console.error(`An error occurred: \n ${rawUrl} \n`, err);
		return { errorMessage: 'An error occurred while getting the favicon!', status: 500 };
	}
};

export const GET: RequestHandler = async ({ url, fetch }) => {
	const data = url.searchParams.get('url');

	let favicon;

	if (data) {
		favicon = await fetchFavicon(fetch, data);
		if (favicon.favicon) {
			return new Response(JSON.stringify(favicon), { status: 200 });
		} else {
			return new Response(favicon.errorMessage, { status: favicon.status });
		}
	} else {
		return new Response('Missing URL', { status: 400 });
	}
};
