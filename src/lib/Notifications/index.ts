import { writable, type Writable } from 'svelte/store';

export enum NotificationType {
	INFO = 'info',
	SUCCESS = 'success',
	WARN = 'warn',
	ERROR = 'error'
}

export type NotificationAction = {
	onClick: () => void;
	icon?: string;
	text?: string;
};

export interface NotificationContent {
	message: string;
	actions?: NotificationAction[];
}

export class UINotification {
	static DURATION = 10000;
	public static get toasts() {
		return toasts;
	}

	_id: string;
	type: NotificationType;
	content: NotificationContent;
	duration: number = UINotification.DURATION;
	dismissable: boolean = true;
	redirectTarget?: string;

	constructor(
		type: NotificationType,
		content: NotificationContent | string,
		duration: number = UINotification.DURATION,
		redirectTarget?: string,
		dismissable = true
	) {
		this._id = crypto.randomUUID();
		this.type = type;
		this.content = typeof content === 'string' ? { message: content } : content;
		this.duration = duration === undefined ? UINotification.DURATION : duration;
		this.redirectTarget = redirectTarget;
		this.dismissable = dismissable;
	}

	public get id() {
		return this._id;
	}

	showToast() {
		UINotification.toasts.show(this);
	}

	dismissToast() {
		UINotification.toasts.dismiss(this.id);
	}
}

class ToastedNotification {
	notification: UINotification;
	_timeout: ReturnType<typeof setTimeout>;

	constructor(notifiaction: UINotification, duration: number) {
		this.notification = notifiaction;
		this._timeout = setTimeout(() => {
			UINotification.toasts.dismiss(this.notification.id);
		}, duration);
	}

	clearTimeout() {
		clearTimeout(this._timeout);
	}
}

function createToasts(limitToasts: number) {
	const { subscribe, set, update } = writable<UINotification[]>(<UINotification[]>[]);
	const timeouts: ReturnType<typeof setTimeout>[] = [];

	const toastStore = {
		subscribe,
		clear: () => {
			set([]);
			timeouts.forEach(clearInterval);
			timeouts.length = 0;
		},
		dismiss: (id: string) =>
			update((current) => {
				const index = current.findIndex((n) => n.id === id);
				clearTimeout(timeouts[index]);
				timeouts.splice(index, 1);
				current.splice(index, 1);
				return current;
			}),
		show: (notification: UINotification) =>
			update((current) => {
				if (current.length == limitToasts) {
					current.shift();
					clearTimeout(timeouts.shift());
				}
				current.push(notification);
				timeouts.push(
					setTimeout(() => {
						toastStore.dismiss(notification.id);
					}, notification.duration)
				);
				return current;
			})
	};
	return toastStore;
}

function instantNotification(type: NotificationType, message: string, redirectTarget?: string) {
	const notification = new UINotification(
		type,
		message,
		UINotification.DURATION,
		redirectTarget,
		true
	);
	notification.showToast();
}

export const success = (message: string, redirectTarget?: string) => {
	instantNotification(NotificationType.SUCCESS, message, redirectTarget);
};
export const info = (message: string, redirectTarget?: string) => {
	instantNotification(NotificationType.INFO, message, redirectTarget);
};
export const warn = (message: string, redirectTarget?: string) => {
	instantNotification(NotificationType.WARN, message, redirectTarget);
};
export const error = (message: string, redirectTarget?: string) => {
	instantNotification(NotificationType.ERROR, message, redirectTarget);
};

export const toasts = createToasts(5);
