import axiosClient from "../axiosClient.ts";

export const fileShareApi = {
    getFile: (filename: string) =>
        axiosClient.get(`/files/${filename}`, {
            responseType: 'blob'
        }
    ),
}