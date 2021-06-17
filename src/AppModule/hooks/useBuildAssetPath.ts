import { useGlobalData } from "../contexts/GlobalContext";
import { API_HOST } from "../config/app-env";
import { CONSTANTS } from "../../config";
import { FileTypeInfo } from "../models";

const {
    Container: { STORAGE },
} = CONSTANTS;

export function useBuildAssetPath(
    fileInfo: FileTypeInfo,
    fileName: string | null = null
): string {
    const { container } = useGlobalData();

    if (!container) {
        return "";
    }

    const { id, storage, bucketEndpoint, bucketName, bucketRegion } = container;
    const { path } = fileInfo;
    let basePath = "";

    if (storage === STORAGE.STORAGE_S3) {
        if (bucketEndpoint) {
            basePath = `${bucketEndpoint}/${bucketName}`;
        } else {
            basePath = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com`;
        }
    } else {
        basePath = `${API_HOST}/uploads/${id}`;
    }

    if (path) {
        basePath = `${basePath}/${path}`;
    }

    if (fileName) {
        return `${basePath}/${fileName}`;
    }

    return basePath;
}
