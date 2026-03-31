import axiosClient from "../axiosClient.ts";

const toNullableFileResponse = (response: any) => {
    if (response.status === 204 || !response.data || (response.data instanceof Blob && response.data.size === 0)) {
        return { data: null } as any;
    }

    return response;
};

export const fileShareApi = {
    getFile: (imageReference: string) => {
        const normalized = imageReference.trim();

        if (normalized.startsWith("/api/user/")) {
            return axiosClient.get(normalized.replace(/^\/api/, ""), {
                responseType: 'blob',
                validateStatus: (status) => status < 500,
            }).then(toNullableFileResponse);
        }

        if (normalized.startsWith("http") || normalized.startsWith("data:")) {
            return Promise.resolve({ data: normalized } as any);
        }

        if (normalized.startsWith("/api/")) {
            return axiosClient.get(normalized.replace(/^\/api/, ""), {
                responseType: 'blob',
                validateStatus: (status) => status < 500,
            }).then(toNullableFileResponse);
        }

        const withoutLeadingSlash = normalized.replace(/^\/+/, "");
        const legacyFileName = withoutLeadingSlash.startsWith("uploads/")
            ? withoutLeadingSlash.replace(/^uploads\//, "")
            : withoutLeadingSlash;

        return axiosClient.get(`/files/${encodeURIComponent(legacyFileName)}`, {
            responseType: 'blob',
            validateStatus: (status) => status < 500,
        }).then(toNullableFileResponse).catch((error) => {
            console.warn(`File not found: ${legacyFileName}`, error);
            return { data: null } as any;
        });
    },
}