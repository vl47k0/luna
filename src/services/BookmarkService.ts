import axios, { AxiosInstance } from 'axios';

export interface EmailAddress {
  id: string;
  email: string;
  is_registered: boolean;
  is_verified: boolean;
}

export interface Unit {
  id: string;
  title: string;
  parent?: string | null;
  administrators: string[];
  timestamp: string;
}

export interface Link {
  id: string;
  unit?: string | null;
  title: string;
  href: string;
  timestamp: string;
}

export interface UnitListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Unit[];
}

export interface LinkListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Link[];
}

export interface EmailAddressListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: EmailAddress[];
}

export interface GroupedUnitLinks {
  unit: {
    id: string;
    title: string;
  };
  links: Link[];
}

export class BookmarkService {
  private client: AxiosInstance;

  constructor(baseURL: string, token: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async fetchGroupedLinks(): Promise<GroupedUnitLinks[] | null> {
    try {
      const response = await this.client.get<GroupedUnitLinks[]>(
        `bookmark/api/v1/units/self/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching grouped links:', error);
      return null;
    }
  }

  async fetchGroupedLinksForUnit(
    unitId: string
  ): Promise<GroupedUnitLinks[] | null> {
    try {
      const response = await this.client.get<GroupedUnitLinks[]>(
        `bookmark/api/v1/units/${unitId}/self/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching grouped links:', error);
      return null;
    }
  }

  async fetchUnits(page: number): Promise<UnitListResponse | null> {
    try {
      console.log('Fetching Page:', page);
      const response = await this.client.get<UnitListResponse>(
        `bookmark/api/v1/units/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching units:', error);
      return null;
    }
  }

  async addLinkToUnit(
    unitId: string,
    title: string,
    href: string
  ): Promise<Link | null> {
    try {
      const response = await this.client.post<Link>(
        `bookmark/api/v1/units/${unitId}/link/`,
        {
          title,
          href,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to add link to unit ${unitId}:`, error);
      return null;
    }
  }

  async fetchUnitById(unitId: string): Promise<Unit | null> {
    try {
      const response = await this.client.get<Unit>(
        `bookmark/api/v1/units/${unitId}/`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching unit ${unitId}:`, error);
      return null;
    }
  }

  async createUnit(input: Partial<Unit>): Promise<Unit | null> {
    try {
      const response = await this.client.post<Unit>(
        `bookmark/api/v1/units/`,
        input
      );
      console.log('Unit created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating unit:', error);
      return null;
    }
  }

  async updateUnit(unitId: string, input: Partial<Unit>): Promise<Unit | null> {
    try {
      const response = await this.client.patch<Unit>(
        `bookmark/api/v1/units/${unitId}/`,
        input
      );
      console.log('Unit updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating unit ${unitId}:`, error);
      return null;
    }
  }

  async deleteUnit(unitId: string): Promise<boolean> {
    try {
      await this.client.delete(`bookmark/api/v1/units/${unitId}/`);
      console.log('Unit deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting unit ${unitId}:`, error);
      return false;
    }
  }

  async fetchLinks(page: number): Promise<LinkListResponse | null> {
    try {
      console.log('Fetching Page:', page);
      const response = await this.client.get<LinkListResponse>(
        `bookmark/api/v1/links/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching links:', error);
      return null;
    }
  }

  async fetchLinkById(linkId: string): Promise<Link | null> {
    try {
      const response = await this.client.get<Link>(
        `bookmark/api/v1/links/${linkId}/`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching link ${linkId}:`, error);
      return null;
    }
  }

  async createLink(input: Partial<Link>): Promise<Link | null> {
    return this.addLink(input);
  }

  async addLink(input: Partial<Link>): Promise<Link | null> {
    try {
      const response = await this.client.post<Link>(
        `bookmark/api/v1/links/`,
        input
      );
      console.log('Link added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding link:', error);
      return null;
    }
  }

  async updateLink(linkId: string, input: Partial<Link>): Promise<Link | null> {
    try {
      const response = await this.client.patch<Link>(
        `bookmark/api/v1/links/${linkId}/`,
        input
      );
      console.log('Link updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating link ${linkId}:`, error);
      return null;
    }
  }

  async deleteLink(linkId: string): Promise<boolean> {
    try {
      await this.client.delete(`bookmark/api/v1/links/${linkId}/`);
      console.log('Link deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting link ${linkId}:`, error);
      return false;
    }
  }
}
