export enum RoomState {
    READY = "ready",
    ACTIVE = "active",
    PAUSED = "paused",
    FINISHED = "finished",
    STOPPED = "stopped"
}

export interface RoomBase {
    id: number;
    slug: string;
    state: RoomState;
    baseTime: number;
    extraTime: number;
    startedOn?: string;
    pausedOn?: string;
    stoppedOn?: string;
    completion: number;
    name: string;
    imageUrl?: string;
    maxCompletion: number;
    stage?: string
}

