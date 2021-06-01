import React, { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AppCropper } from "../AppCropper";
import { AppButton } from "../AppButton";
import { bytesToSize } from "./bytes-to-size";
import { Upload } from "../../models";

import "./assets/scss/style.scss";

export interface AppFile {
    preview: string;
    name: string;
}
export interface AppUploaderProps {
    maxSize?: number;
    minSize?: number;
    maxFiles?: number;
    accept?: string;
    withCropper?: boolean;
    onReady?: (startFnc: () => void) => void;
    onFileSelect: (files: File[]) => void;
    onFinish?: (error: null | string, upload?: Upload) => void;
}

export const AppUploader: FC<AppUploaderProps> = ({
    accept = ["image/*", "video/*", "audio/*"],
    maxFiles = 1,
    maxSize = Infinity,
    minSize = 0,
    withCropper,
    onFileSelect,
}): JSX.Element => {
    const [files, setFiles] = useState<AppFile[]>([]);
    const [cropperFile, setCropperFile] = useState<any>(undefined);

    const [showCropModal, setShowCropModal] = useState<boolean>(false);
    const [cropUrl, setCropUrl] = useState<string>("");

    const {
        getRootProps,
        getInputProps,
        fileRejections,
        acceptedFiles,
    } = useDropzone({
        accept,
        maxFiles,
        minSize,
        maxSize,
        onDrop: (accepted) => {
            setFiles(
                accepted.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
            onFileSelect(accepted);
        },
    });

    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.name}>
            File Name: {file.name} <br /> Size:{" "}
            {bytesToSize(cropperFile ? cropperFile.size : file.size)}
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li>
            {file.name} -
            {bytesToSize(cropperFile ? cropperFile.size : file.size)}
            <ul className="erorrs-list">
                {errors.map((e) => (
                    <li key={e.code} className="error-name">
                        Error: {e.message}
                    </li>
                ))}
            </ul>
        </li>
    ));

    const thumbs = files.map((f: any) => (
        <div className="thumb-container">
            <div className="thumb-inner">
                <img src={cropUrl || f.preview} />
            </div>
        </div>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach((f: any) => URL.revokeObjectURL(f.preview));
            setCropUrl("");
            setCropperFile(undefined);
        },
        [files]
    );

    return (
        <section className="app-uploader">
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p className="drag-text">
                    Drag 'n' drop some files here, or click to select files
                </p>
            </div>
            <aside className="dropzone-thumbs-container">{thumbs}</aside>
            <div className="accepted-rejected">
                <div>{acceptedFiles.length > 0 && "Accepted:"}</div>
                <ul>{acceptedFileItems}</ul>
                <div className="rejected">
                    {fileRejectionItems.length > 0 && "Rejected:"}
                </div>
                <ul>{fileRejectionItems}</ul>
            </div>
            {acceptedFiles.length > 0 && (
                <div className="d-flex w-100 justify-content-start">
                    {withCropper && (
                        <AppButton
                            handleClick={() => {
                                setShowCropModal(true);
                            }}
                            variant="secondary"
                        >
                            Edit
                            <AppCropper
                                show={showCropModal}
                                image={files}
                                initialAspectRatio={16 / 9}
                                handleClose={() => {
                                    setShowCropModal(false);
                                    setCropUrl(files[0].preview);
                                }}
                                handleSave={(url) => {
                                    setShowCropModal(false);
                                    setCropUrl(url);
                                }}
                                handleBlob={(blob) => {
                                    setCropperFile(blob);
                                    onFileSelect(blob);
                                }}
                            />
                        </AppButton>
                    )}
                </div>
            )}
        </section>
    );
};
