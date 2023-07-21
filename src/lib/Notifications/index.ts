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
	public static get store() {
		return notifications;
	}

	_id: string;
	type: NotificationType;
	content: NotificationContent;
	duration: number = UINotification.DURATION;
	dismissable: boolean = true;
	redirectTarget?: string;
	_timeout?: ReturnType<typeof setInterval>;

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

	show() {
		UINotification.store.show(this);
	}
	dismiss() {
		UINotification.store.dismiss(this);
	}

	scheduleHide(duration?: number) {
		duration = duration ?? this.duration;
		clearInterval(this._timeout);
		if (!duration) return;
		this._timeout = setInterval(() => {
			UINotification.store.dismiss(this);
		}, duration);
	}
}

function createNotifications() {
	const { subscribe, set, update } = writable<UINotification[]>(<UINotification[]>[]);

	return {
		subscribe,
		clear: () => set([]),
		dismiss: (notification: UINotification) =>
			update((current) => {
				return current.filter((notif) => {
					if (notification === notif) {
						clearInterval(notif._timeout);
						return false;
					}
					return true;
				});
			}),
		show: (notification: UINotification) =>
			update((current) => {
				current.push(notification);
				notification.scheduleHide();
				return current;
			})
	};
}

export const notifications = createNotifications();
