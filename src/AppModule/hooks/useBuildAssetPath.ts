import { useAuthState } from "./useAuthState";
import { API_HOST } from "../config/app-env";

// @TODO: instead of passing folder, use constant fileInfo
export function useBuildAssetPath(
    folder: string,
    fileName: string | null = null
) {
    const { containerId } = useAuthState();

    // @TODO: Build AWS path based on container
    // $css3_base_url: 'https://%env(CSS3_HOST)%/[BUCKET_NAME]/'
    // $aws_uploader_bucket_base_url: 'https://[BUCKET_NAME].s3.%env(AWS_REGION)%.amazonaws.com/'
    if (fileName) {
        return `${API_HOST}/uploads/${containerId}/${folder}/${fileName}`;
    }

    return `${API_HOST}/uploads/${containerId}/${folder}`;
}
