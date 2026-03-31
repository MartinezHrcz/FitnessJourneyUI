import axiosClient from "../axiosClient.ts";

const toNullableFileResponse = (response: any) => {
    const contentType = (response?.headers?.["content-type"] ?? response?.headers?.["Content-Type"] ?? "").toString().toLowerCase();
    const hasBlobPayload = response.data instanceof Blob;
    const isImageBlob = hasBlobPayload && (response.data.type?.toLowerCase().startsWith("image/") || contentType.startsWith("image/"));

    if (
        response.status === 204 ||
        response.status === 404 ||
        !response.data ||
        (hasBlobPayload && response.data.size === 0) ||
        (hasBlobPayload && !isImageBlob)
    ) {
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

        if (normalized.startsWith("/api/") || normalized.startsWith("api/")) {
            const normalizedApiPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
            return axiosClient.get(normalizedApiPath.replace(/^\/api/, ""), {
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