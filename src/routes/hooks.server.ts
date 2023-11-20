// Copyright (C) 2023 Jannis Machowetz
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {

	// Apply CORS header for API routes
	if(event.request.method === 'OPTIONS') {
		// @ts-ignore
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
			}
		});
	}

	const response = await resolve(event);
	response.headers.append('Access-Control-Allow-Origin', `*`);
	return response;
};