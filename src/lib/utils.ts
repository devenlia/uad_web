// Copyright (C) 2023 Jannis Machowetz
import { addToast } from '$lib/stores/toastStore';

export const throwError = (status: number, text: string) => {
	addToast({ id: '', priority: 2, message: `An error occurred. Please check the console for detailed information.` });
	console.error(`An error occurred. Status: ${status}, Message: ${text}`);
};
