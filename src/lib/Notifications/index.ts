import { writable, type Writable } from 'svelte/store';
import type { Fragment } from 'svelte/types/compiler/interfaces';

export enum NotificationType {
	INFO = 'info',
	SUCCESS = 'success',
	WARN = 'warn',
	ERROR = 'error'
}

export class Notification {
	_id: string;
	type: NotificationType;
	content: string | Fragment;
	duration: number = 3000;
	dismissable: boolean = true;
	redirectTarget?: string;
	_timeout?: ReturnType<typeof setInterval>;

	constructor(
		type: NotificationType,
		content: string | Fragment,
		redirectTarget?: string,
		duration = 3000,
		dismissable = true
	) {
		this._id = crypto.randomUUID();
		this.type = type;
		this.content = content;
		this.redirectTarget = redirectTarget;
		this.duration = duration;
		this.dismissable = dismissable;
	}

	public get id() {
		return this._id;
	}

	schedule(store: ReturnType<typeof createNotifications>, duration?: undefined) {
		this.duration = duration ? duration : this.duration;
		clearInterval(this._timeout);
		this._timeout = setInterval(() => {
			store.dismiss(this);
		});
	}
}

class ScheduledNotification extends Notification {}

function createNotifications() {
	const { subscribe, set, update } = writable<Notification[]>(<Notification[]>[]);

	return {
		subscribe,
		clear: () => set([]),
		dismiss: (notification: Notification | string) =>
			update((current) => {
				return current.reduce((acc, notif) => {
					if (
						(notification instanceof Notification && notification === notif) ||
						notification == notif.id
					) {
						clearInterval(notif._timeout);
					} else {
						acc.push(notif);
					}
					return acc;
				}, <Notification[]>[]);
			}),
		create: (notification: Notification) =>
			update((current) => {
				notification.schedule(this);
				current.push(notification);
				return current;
			})
	};
}
