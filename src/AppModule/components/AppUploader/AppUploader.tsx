import React, { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AppCropper } from "../AppCropper";
import { AppButton } from "../AppButton";
import { bytesToSize } from "./bytes-to-size";
import { errorToast, successToast } from "../../utils";
import { UploadAPI } from "../../apis/uploadAPI";
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
}

export const AppUploader: FC<AppUploaderProps> = ({
    accept = ["image/*", "video/*", "audio/*"],
    maxFiles = 1,
    maxSize = Infinity,
    minSize = 0,
    withCropper,
}): JSX.Element => {
    const [files, setFiles] = useState<AppFile[]>([]);
    const [croperFile, setCropperFile] = useState<any>(undefined);

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
        },
    });

    const uploadHandler = () => {
        const fd = new FormData();
        fd.set("file", croperFile || files[0], files[0].name);
        fd.set("fileType", "CONTAINER_POSTER");

        UploadAPI.createResource(fd).then(({ error, errorMessage }) => {
            // eslint-disable-next-line no-console
            console.error(error);
            if (errorMessage) {
                errorToast(errorMessage);
            } else {
                successToast("Image updated");
            }
        });
    };

    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.name}>
            File Name: {file.name} <br /> Size:{" "}
            {bytesToSize(croperFile ? croperFile.size : file.size)}
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li>
            {file.name} - {file.size} bytes
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
            {acceptedFiles.length > 0 && withCropper && (
                <div className="d-flex w-100 justify-content-start">
                    <AppButton
                        handleClick={() => {
                            setShowCropModal(true);
                        }}
                        variant="secondary"
                    >
                        Edit image
                    </AppButton>
                    <AppButton
                        variant="primary"
                        className="ml-3"
                        handleClick={() => {
                            uploadHandler();
                        }}
                    >
                        Save
                    </AppButton>

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
                        }}
                    />
                </div>
            )}
        </section>
    );
};
