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
    started_on: string;
    paused_on: string;
    stopped_on: string;
    completion: number;
    name: string;
    image_url: string;
    max_completion: number;
}
