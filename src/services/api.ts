import api from '@/services/request';
import { IMarsImages, IRoverInfo } from '@/models/models';

export default class MarsService {
    static async getRoverImagesBySol(roverName: string, sol: number): Promise<IMarsImages[]> {
        try {
            const response = await api.get(`https://mars-photos.herokuapp.com/api/v1/rovers/${roverName}/photos?sol=${sol}`);
            console.log(response);
            return response.data.photos;
        } catch (e) {
            throw e.data;
        }
    }

    static async getRoverImagesByEarthDay(roverName: string, day: string): Promise<IMarsImages[]> {
        try {
            const response = await api.get(`https://mars-photos.herokuapp.com/api/v1/rovers/${roverName}/photos?earth_date=${day}`);
            console.log(response);
            return response.data.photos;
        } catch (e) {
            throw e.data;
        }
    }

    static async getRoverManifest(roverName: string): Promise<IRoverInfo> {
        try {
            const response = await api.get(`https://mars-photos.herokuapp.com/api/v1/manifests/${roverName}`);
            return response.data.photo_manifest;
        } catch(e) {
            throw e.data;
        }
    }
}
