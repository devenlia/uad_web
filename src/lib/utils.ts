// Copyright (C) 2023 Jannis Machowetz
import { addToast } from '$lib/stores/toastStore';
import { closeContentWizard } from '$lib/modals/creation';

export const throwError = (status: number, text: string) => {
	addToast({ id: '', priority: 2, message: `An error occurred. Please check the console for detailed information.` });
	console.error(`An error occurred. Status: ${status}, Message: ${text}`);
};

export const loadParent = async (parentId: string, type: string) => {
	switch (type) {
		case 'page':
			return { page: await fetchData(`/get?type=page&id=${parentId}`), container: null, category: null };
		case 'container':
			return { page: await fetchData(`/get?type=page&id=${parentId}`), container: null, category: null };
		case 'category':
			let catParentCont = await fetchData(`/get?type=container&id=${parentId}`);
			let catParentPage = await fetchData(`/get?type=page&id=${catParentCont.parentId}`);
			return { page: catParentPage, container: catParentCont, category: null };
		case 'link':
			let parentCat = await fetchData(`/get?type=category&id=${parentId}`);
			let parentCont = await fetchData(`/get?type=container&id=${parentCat.parentId}`);
			let parentPage = await fetchData(`/get?type=page&id=${parentCont.parentId}`);
			return { page: parentPage, container: parentCont, category: parentCat };
		default:
			return loadParentByPath('home');
	}
};

export const loadParentByPath = async (path: string) => {
	let parentPage = await fetchData(`/get?type=search&path=${path}`);

	if (!parentPage) {
		await closeContentWizard();
		throwError(500, 'Unknown error');
		return;
	}
	return { page: parentPage, container: parentPage.containers[0], category: parentPage.containers[0]?.categories[0] };
};

export const fetchData = async (url: string) => {
	let res: Response;
	res = await fetch(url);

	if (res.status != 200) {
		await closeContentWizard()
		// TODO: Close Mod modal
		throwError(res.status, await res.text());
		return;
	}

	return await res.json();
};
