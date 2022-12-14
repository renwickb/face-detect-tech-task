import axios, { type AxiosRequestConfig } from "axios";
import type { AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth";

class HttpService {
    public async get<T>(
        url: string,
        params?: Record<string, string>,
        headers?: Record<string, string>
    ): Promise<AxiosResponse<T>> {
        return await axios.get(url, {
            ...this.getAxiosConfig(headers),
            params,
        });
    }

    public async post<R, T = any>(
        url: string,
        data: T,
        headers?: Record<string, string>
    ): Promise<AxiosResponse<R>> {
        return await axios.post(url, data, this.getAxiosConfig(headers));
    }

    private getAxiosConfig<T>(
        headers?: Record<string, string>
    ): AxiosRequestConfig<T> {
        const baseURL = import.meta.env.VITE_APP_API_URL;

        return {
            baseURL,
            headers: {
                "content-type": "application/json",
                ...this.getAuthorisationHeader(),
                ...(headers || {}),
            },
        };
    }

    private getAuthorisationHeader(): Record<string, string> {
        const { authToken } = useAuthStore();

        if (authToken) {
            return {
                authorization: `Bearer ${authToken}`,
            };
        }

        return {};
    }
}

export const httpService = new HttpService();
