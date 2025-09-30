import axios, { AxiosInstance } from 'axios';

export interface Service {
  id: string;
  data: string;
  name: string;
}

export interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export class MapperService {
  private client: AxiosInstance;

  constructor(baseURL: string, token: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async fetchService(contactId: string): Promise<Service | null> {
    try {
      const response = await this.client.get<Service>(
        `service/api/v1/units/${contactId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  }

  async fetchServices(): Promise<Service[] | null> {
    try {
      const response = await this.client.get<Service[]>(
        `service/api/v1/units/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return null;
    }
  }
}
