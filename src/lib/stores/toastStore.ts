// Copyright (C) 2023 Jannis Machowetz
import { writable } from 'svelte/store';

interface Toast {
	id: string;
	priority: number;
	message: string;
}

export const Toasts = writable<Array<Toast>>([]);

export const closeToast = (id: string) => {
	Toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
};

export const addToast = (toast: Toast) => {
	const uniqueId = Date.now().toString();

	Toasts.update((toasts) => [...toasts, { ...toast, id: uniqueId }]);

	setTimeout(() => closeToast(uniqueId), 10000);
};
