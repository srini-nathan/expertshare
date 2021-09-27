import { useGlobalData } from "../contexts/GlobalContext";
import { API_HOST } from "../config/app-env";
import { CONSTANTS } from "../../config";
import { FileTypeInfo } from "../models";

const {
    Container: { STORAGE },
    Upload: { FILETYPE },
} = CONSTANTS;

export function useBuildAssetPath(
    fileInfo: FileTypeInfo,
    fileName: string | null = null
): string {
    const { container } = useGlobalData();

    if (!container) {
        return "";
    }

    const { path, key } = fileInfo;
    let { id, storage, bucketEndpoint, bucketName, bucketRegion } = container;

    let basePath = "";
    basePath = `${API_HOST}/uploads/container_${id}`;

    if (
        typeof container.client === "object" &&
        (key === FILETYPE.FILETYPE_USER_PROFILE ||
            key === FILETYPE.FILETYPE_CONTAINER_POSTER)
    ) {
        id = container.client.id;
        storage = container.client.storage;
        bucketEndpoint = container.client.bucketEndpoint;
        bucketName = container.client.bucketName;
        bucketRegion = container.client.bucketRegion;

        basePath = `${API_HOST}/uploads/client_${id}`;
    }

    if (storage === STORAGE.STORAGE_S3) {
        if (bucketEndpoint) {
            basePath = `${bucketEndpoint}/${bucketName}`;
        } else {
            basePath = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com`;
        }
    }

    if (path) {
        basePath = `${basePath}/${path}`;
    }

    if (fileName) {
        return `${basePath}/${fileName}`;
    }

    return basePath;
}
