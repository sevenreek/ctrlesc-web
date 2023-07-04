enum RoomState {
    READY = "ready",
    ACTIVE = "active",
    PAUSED = "paused",
    FINISHED = "finished",
    STOPPED = "stopped"
}

interface RoomDisplay {
    id: number;
    slug: string;
    state: RoomState;
    base_time: number;
    extra_time: number;
    started_on: Date;
    paused_on: Date;
    stopped_on: Date;
    completion: number;
    name: string;
    image_url: string;
    max_completion: number;
}
