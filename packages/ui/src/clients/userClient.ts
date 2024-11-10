import { User } from '../models/userModels';
import { BaseClient } from './baseClient';

export interface UserQueryParams {
    page?: number;
    name?: string;
    email?: string;
    phone?: string;
    userId?: string;
    orgId?: string;
    clerkId?: string;
    pageSize?: number;
    userIds?: string[];
}

export class UserClient extends BaseClient {
    public static async getUser(userId: string, token: string | null): Promise<User> {
        return this.fetchData(`/users/${userId}`, token, null);
    }

    public static async createUser(
        user: User,
        token: string | null,
        userType?: string // Add userType as an optional parameter
    ): Promise<{ message: string; user: User }> {
        const body = { user, userType }; // Include userType in the body if provided
        return this.postData(`/users`, body, token, null);
    }

    public static async updateUser(
        userId: string,
        user: User,
        token: string | null
    ): Promise<{ message: string; user: User }> {
        return this.putData(`/users/${userId}`, user, token, null);
    }

    public static async deleteUser(userId: string, token: string | null): Promise<{ message: string }> {
        return this.deleteData(`/users/${userId}`, token, null);
    }


    public static async emptyCart(
        userId: string,
        user: User,
        token: string | null
    ): Promise<{ message: string; user: User }> {
        const updatedUser: User = {
            ...user, // Copy existing user properties
            cart: [], // Set cart to an empty array
        };
        return this.putData(`/users/${userId}`, updatedUser, token, null);
    }

    public static async getUsers(params: UserQueryParams, token: string | null): Promise<User[]> {
        const endpoint = `/users?${this.constructQueryString(params)}`;
        return this.fetchData(endpoint, token, null);
    }
    
    public static constructQueryString(params: UserQueryParams): string {
        const queries = [];
        if (params.userId) {
            queries.push(`user_id=${params.userId}`);
        }
        if (params.orgId && params.orgId.length > 0) {
            queries.push(`org_id=${params.orgId}`);
        }
        if (params.clerkId) {
            queries.push(`clerk_id=${params.clerkId}`);
        }
        if (params.page) {
            queries.push(`page=${params.page}`);
        }
        if (params.pageSize) {
            queries.push(`page_size=${params.pageSize}`);
        }
        if (params.name) {
            queries.push(`name=${params.name}`);
        }
        if (params.email) {
            queries.push(`email=${params.email}`);
        }
        if (params.phone) {
            queries.push(`phone=${params.phone}`);
        }
        if (params.userIds && params.userIds.length > 0) {
            queries.push(`user_ids=${params.userIds.filter(id => id !== '').join(',')}`);
        }
        return queries.join('&');
    }
    
}