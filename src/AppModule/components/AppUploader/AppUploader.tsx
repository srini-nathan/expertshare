import React, { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "react-bootstrap";
import { AppCropper } from "../AppCropper";
import "./assets/scss/style.scss";

export interface AppUploaderProps {
    maxSize?: number;
    minSize?: number;
    maxFiles?: number;
    accept?: string;
    withCropper?: boolean;
}

export const AppUploader: FC<AppUploaderProps> = ({
    accept = "image/*, video/*, audio/*",
    maxFiles = 1,
    maxSize = Infinity,
    minSize = 0,
    withCropper,
}): JSX.Element => {
    const [files, setFiles] = useState<any>([]);
    const [showCropModal, setShowCropModal] = useState<boolean>(false);
    const [cropUrl, setCropUrl] = useState<string>("");

    const [imageToUpload, setImageToUpload] = useState<string>();

    // eslint-disable-next-line no-console
    console.log(imageToUpload);

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

    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.name}>
            {file.name} - {file.size} bytes
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
        },
        [files]
    );

    return (
        <section className="container-dropzone">
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
                    <Button
                        onClick={() => {
                            setShowCropModal(true);
                        }}
                        variant="secondary"
                    >
                        Edit image
                    </Button>
                    <Button
                        variant="primary ml-2"
                        onClick={() => {
                            setImageToUpload(cropUrl || files[0].preview);
                        }}
                    >
                        Save
                    </Button>

                    <AppCropper
                        show={showCropModal}
                        image={files}
                        handleClose={() => {
                            setShowCropModal(false);
                            setCropUrl(files[0].preview);
                        }}
                        handleSave={(url) => {
                            setShowCropModal(false);
                            setCropUrl(url);
                        }}
                    />
                </div>
            )}
        </section>
    );
};
