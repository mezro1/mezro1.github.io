import { Rovers } from "@/views/MainView.vue";

export interface IRoverInfo {
    landing_date: string,
    launch_date: string,
    max_date: string,
    max_sol: number,
    name: Rovers,
    status: string,
    total_photos: number,
    photos: {
        sol: number,
        earth_date: string,
        total_photos: number,
        cameras: string[],
    }[],
}

export interface IMarsImages {
    id: number,
    earth_date: string,
    img_src: string,
    sol: number,
    camera: {
        name: string,
        full_name: string,
    },
}
