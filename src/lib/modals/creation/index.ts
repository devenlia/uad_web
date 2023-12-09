// Copyright (C) 2023 Jannis Machowetz
import { Visible, Action, Parent, reset, Tutorial } from './store';
import { addToast } from '$lib/stores/toastStore';
import CreationModal from './main.svelte';
import { loadParent, loadParentByPath, throwError } from '$lib/utils';

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


