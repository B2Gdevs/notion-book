export class BaseClient {
  public static BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '';


  private static getHeaders(token: string | null): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  public static async fetchData(endpoint: string, token: string | null, baseUrl: string | null): Promise<any> {
    try {
      const baseurl = baseUrl || this.BASE_URL;
      const headers = this.getHeaders(token);
      const response = await fetch(`${baseurl}${endpoint}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw { status: response.status, body: responseBody };
      }

      return response.json();
    } catch (err) {
      throw err;
    }
  }

  public static async postData(endpoint: string, data: any, token: string | null, baseUrl: string| null): Promise<any> {
    try {
      const baseurl = baseUrl || this.BASE_URL;
      const response = await fetch(`${baseurl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw { status: response.status, body: responseBody };
      }

      return response.json();
    } catch (err) {
      throw err;
    }
  }

  public static async putData(endpoint: string, data: any, token: string | null, baseUrl: string | null): Promise<any> {
    try {
      const baseurl = baseUrl || this.BASE_URL;
      const response = await fetch(`${baseurl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw { status: response.status, body: responseBody };
      }

      return response.json();
    } catch (err) {
      throw err;
    }
  }

  public static async patchData(endpoint: string, data: any, token: string | null, baseUrl: string | null): Promise<any> {
    try {
      const baseurl = baseUrl || this.BASE_URL;
      const response = await fetch(`${baseurl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw { status: response.status, body: responseBody };
      }

      return response.json();
    } catch (err) {
      throw err;
    }
  }

  public static async deleteData(endpoint: string, token: string | null, baseUrl: string | null): Promise<any> {
    try {
      const baseurl = baseUrl || this.BASE_URL;
      const response = await fetch(`${baseurl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw { status: response.status, body: responseBody };
      }

      // Check if the response is a 204 No Content
      if (response.status === 204) {
        return { message: 'Resource deleted successfully' };
      }

      return response.json();
    } catch (err) {
      throw err;
    }
  }
}