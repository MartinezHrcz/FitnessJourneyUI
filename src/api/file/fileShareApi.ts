import axiosClient from "../axiosClient.ts";

export const fileShareApi = {
    getFile: (imageReference: string) => {
        const normalized = imageReference.trim();

        if (normalized.startsWith("/api/user/")) {
            return axiosClient.get(normalized.replace(/^\/api/, ""), {
                responseType: 'blob',
                validateStatus: (status) => status < 500,
            }).then((res) => {
                if (res.status === 204 || !res.data || (res.data instanceof Blob && res.data.size === 0)) {
                    return { data: null } as any;
                }
                return res;
            });
        }

        if (normalized.startsWith("http") || normalized.startsWith("data:")) {
            return Promise.resolve({ data: normalized } as any);
        }

        if (normalized.startsWith("/api/")) {
            return axiosClient.get(normalized.replace(/^\/api/, ""), {
                responseType: 'blob'
            });
        }

        const withoutLeadingSlash = normalized.replace(/^\/+/, "");
        const legacyFileName = withoutLeadingSlash.startsWith("uploads/")
            ? withoutLeadingSlash.replace(/^uploads\//, "")
            : withoutLeadingSlash;

        return axiosClient.get(`/files/${encodeURIComponent(legacyFileName)}`, {
            responseType: 'blob'
        }).catch((error) => {
            console.warn(`File not found: ${legacyFileName}`, error);
            return { data: null } as any;
        });
    },
}