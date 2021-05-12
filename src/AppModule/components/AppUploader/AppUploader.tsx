import React, { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./assets/scss/style.scss";

export interface AppUploaderProps {
    linkUrl?: string;
    linkText?: string;
}

export const AppUploader: FC<AppUploaderProps> = (): JSX.Element => {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            // eslint-disable-next-line no-console
            reader.onabort = () => console.log("file reading was aborted");
            // eslint-disable-next-line no-console
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                // eslint-disable-next-line no-console
                console.log(reader.result);
            };
        });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
    );
};
