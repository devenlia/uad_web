// Copyright (C) 2023 Jannis Machowetz
import { Visible } from './store';
import { fetchData, loadParent, throwError } from '$lib/utils';
import type { Category, Container, Link, Page } from '$lib/types';
import ModificationModal from './main.svelte'

let Type : 'page' | 'container' | 'category' | 'link' | null;
let Element : Page | Container | Category | Link | null;
let Parent : {page: Page | null, container: Container | null, category: Category | null} | null;

export default ModificationModal;

export { Type, Element, Parent}

export const openModificationModal = async (type: 'page' | 'container' | 'category' | 'link', element: Page | Container | Category | Link | null, elementPath?: string) => {
	let parentId;

	if (element == null && elementPath) {
		Element = await fetchData(`/get?type=search&path=${elementPath}`);
		parentId = Element?.parentId ?? null
	}
	else {
		Element = element
		parentId = element!.parentId
	}

	if (parentId) {
		Parent = (await loadParent(parentId, type))!;
		console.log(Parent);
	}
	else {
		throwError(500, "Something went wrong")
		await closeModificationModal()
		return
	}

	Type = type;
	Visible.set(true);
};

export async function closeModificationModal() {
	Visible.set(false);
	await new Promise((f) => setTimeout(f, 200));
	Type = null;
	Element = null
	Parent = null
}