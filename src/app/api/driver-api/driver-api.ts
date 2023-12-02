import {BaseHttpServices} from "shared/services/base-http-services";
import { IDriver } from "shared/types/api-types/driver";

export class DriverApiService {
    private readonly http: BaseHttpServices;

    constructor(httpService: BaseHttpServices) {
        this.http = httpService;
    }

    getDrivers = async (): Promise<IDriver[]> => {
        const payload = await this.http.get(`/drivers`);
        return payload.data;
    };

    createDriver = async (driver:IDriver): Promise<IDriver> => {
        const payload = await this.http.post('/drivers',driver);
        return payload.data
    }

    updateDriver = async (driver:IDriver): Promise<IDriver> => {
        const payload = await this.http.put(`/drivers/${driver.id}`,driver);
        return payload.data
    }

    deleteDriver = async (driverId:number): Promise<void> => {
        const payload = await this.http.delete(`/drivers/${driverId}`);
        return payload.data
    }
}

export const DriverApi = new DriverApiService(new BaseHttpServices());