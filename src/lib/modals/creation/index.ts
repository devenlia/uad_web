// Copyright (C) 2023 Jannis Machowetz
import { Visible, Action, Parent, reset, Tutorial } from './store';
import { addToast } from '$lib/stores/toastStore';
import CreationModal from './main.svelte';
import { throwError } from '$lib/utils';

export default CreationModal;

export const openContentWizard = async (action: string, path?: any, parentId?: any, tutorial?: boolean) => {
	let parent: any;
	if (action !== 'select' && parentId) parent = await loadParent(parentId, action);
	else parent = await loadParentByPath(path ?? 'home');

	Parent.set(parent);
	Action.set(action);
	Visible.set(true);
	Tutorial.set(tutorial ?? false);
};

export async function closeContentWizard() {
	Visible.set(false);
	await new Promise((f) => setTimeout(f, 200));
	reset();
}

const loadParent = async (parentId: string, type: string) => {
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

const loadParentByPath = async (path: string) => {
	let parentPage = await fetchData(`/get?type=search&path=${path}`);

	if (!parentPage) {
		await closeContentWizard();
		throwError(500, 'Unknown error');
		return;
	}
	return { page: parentPage, container: parentPage.containers[0], category: parentPage.containers[0]?.categories[0] };
};

const fetchData = async (url: string) => {
	let res: Response;
	res = await fetch(url);

	if (res.status != 200) {
		await closeContentWizard();
		throwError(res.status, await res.text());
		return;
	}

	return await res.json();
};
