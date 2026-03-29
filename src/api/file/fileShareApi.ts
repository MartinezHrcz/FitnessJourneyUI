import axiosClient from "../axiosClient.ts";

export const fileShareApi = {
    getFile: (imageReference: string) => {
        const normalized = imageReference.trim();

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
        });
    },
}