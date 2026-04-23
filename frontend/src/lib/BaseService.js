import api from './api';

/**
 * Base service class that provides common API functionality
 * Use inheritance to create specific services
 * e.g. class UserService extends BaseService { ... }
 */
export class BaseService {
  constructor(resource) {
    this.resource = resource;
    this.http = api;
  }

  /**
   * Standard GET request for a list or search
   */
  async getAll(params = {}) {
    const response = await this.http.get(this.resource, { params });
    return response.data;
  }

  /**
   * Standard GET request for a single item
   */
  async getOne(id) {
    const response = await this.http.get(`${this.resource}/${id}`);
    return response.data;
  }

  /**
   * Standard POST request
   */
  async create(data) {
    const response = await this.http.post(this.resource, data);
    return response.data;
  }

  /**
   * Standard PUT request
   */
  async update(id, data) {
    const response = await this.http.put(`${this.resource}/${id}`, data);
    return response.data;
  }

  /**
   * Standard DELETE request
   */
  async delete(id) {
    const response = await this.http.delete(`${this.resource}/${id}`);
    return response.data;
  }
}
