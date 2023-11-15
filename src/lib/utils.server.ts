import { BACKEND_SERVER } from '$env/static/private';
import { dev } from '$app/environment';
import type { HttpMethod } from '@sveltejs/kit';

export const getBackendUrl = () => {
	if (dev) return 'http://localhost:8080';
	else {
		let url = BACKEND_SERVER?.toLowerCase() ?? "server";
		if (!url) throw new Error("Backend server not defined.")
		if (url.startsWith('https://') || url.startsWith('http://')) {
			return url.endsWith('/') ? url.slice(0, -1) : url;
		}
	}
};

export const fetchRequest = async (fetch: any, url: string, method: HttpMethod, body?: string) => {
	let headers = new Headers();
	headers.set('content-type', 'application/json');

	let res = await fetch(url, { headers, method, body });

	return method != 'DELETE' ? await res.json() : null;
};
