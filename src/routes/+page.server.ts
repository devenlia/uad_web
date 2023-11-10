import type { Actions } from './$types';
import { fetchRequest, getBackendUrl, throwError } from '$lib/utils';

const getAddData = (data: FormData) => {
	const type = data.get('type');
	let body;

	switch (type) {
		case 'page':
			body = { name: data.get('name'), path: data.get('path') };
			break;
		case 'link':
			body = { name: data.get('name'), parentId: data.get('parentID'), href: data.get('href') };
			break;
		default:
			body = { name: data.get('name'), parentId: data.get('parentID') };
	}

	return { type, body: JSON.stringify(body) };

	/*throwError(400, "Form submission failed due to missing path or page name.")
  return { status: 400, message: "Bad request"}*/
};

const getDeleteData = (data: FormData) => {
	const type = data.get('type');
	const id = data.get('id');

	return { type, id };
};

export const actions = {
	add: async ({ request, fetch }) => {
		const data = getAddData(await request.formData());

		const url = getBackendUrl() + `/content/${data.type}/add`;
		return await fetchRequest(fetch, url, 'POST', data.body);
	},

	delete: async ({ request, fetch }) => {
		const data = getDeleteData(await request.formData());

		const url = getBackendUrl() + `/content/${data.type}/delete?id=${data.id}`;
		return await fetchRequest(fetch, url, 'DELETE');
	}
} satisfies Actions;
