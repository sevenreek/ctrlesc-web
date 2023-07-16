export enum RoomState {
    READY = "ready",
    ACTIVE = "active",
    PAUSED = "paused",
    FINISHED = "finished",
    STOPPED = "stopped"
}

export interface Room {
    id: number;
    slug: string;
}
export interface RoomDisplay extends Room {
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

export interface Puzzle {
    name: string;
    completionWorth: number;
    completed: boolean;
    state?: object
}

export interface Stage {
    name: string;
    description?: string;
    puzzles: Puzzle[];
}

export interface RoomDetails extends RoomDisplay {
    stages: Stage[];
    activeStage: number;
}