export interface FileTypeInfo {
    key: string;
    width: string | null;
    height: string | null;
    ratio: string | null;
    maxSize: 1;
    allowType: [];
    isSecure?: boolean;
    path: string;
}
