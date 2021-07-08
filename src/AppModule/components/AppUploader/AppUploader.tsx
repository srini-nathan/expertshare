// @TODO: move this to under containers, it has lots of logic
import React, { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Cropper } from "react-cropper";
import { AppCropper } from "../AppCropper";
import { bytesToSize } from "./bytes-to-size";
import { FileTypeInfo, Upload } from "../../models";
import imageTemp from "./assets/images/imgthumb.svg";

import "./assets/scss/style.scss";
import { AppButton } from "../AppButton";
import { AppModal, AppModalRef } from "../AppModal";

type Options = Cropper.Options;

export interface AppFile {
    preview: string;
    name: string;
}
export interface AppUploaderProps {
    maxSize?: number;
    minSize?: number;
    maxFiles?: number;
    ratio?: string;
    width?: string;
    height?: string;
    accept?: string;
    imagePath?: string;
    withCropper?: boolean;
    onReady?: (startFnc: () => void) => void;
    onFileSelect: (files: File[]) => void;
    onFinish?: (error: null | string, upload?: Upload) => void;
    cropperOptions?: Options;
    onDelete?: () => void | boolean;
    fileInfo: FileTypeInfo;
    externalFiles?: any[];
    confirmation?: AppModalRef;
}

export const AppUploader: FC<AppUploaderProps> = ({
    accept = ["image/*", "video/*", "audio/*"],
    maxFiles = 1,
    maxSize = Infinity,
    minSize = 0,
    withCropper,
    imagePath,
    onFileSelect,
    cropperOptions,
    onDelete,
    fileInfo,
    externalFiles,
    confirmation,
}): JSX.Element => {
    const [files, setFiles] = useState<AppFile[]>([]);
    const [changed, isChanged] = useState<boolean>(false);
    const [cropperFile, setCropperFile] = useState<any>(undefined);
    const [showCropModal, setShowCropModal] = useState<boolean>(true);
    const [cropUrl, setCropUrl] = useState<string>("");
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

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
            if (withCropper) setShowCropModal(true);

            setFiles(
                accepted.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
            isChanged(true);

            onFileSelect(accepted);
        },
    });

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
    const thumbs = (externalFiles || files).map((f: any) => (
        <div className="thumb-container">
            <div className="thumb-inner">
                <img src={cropUrl || f.preview} />
            </div>
        </div>
    ));

    const thumb = (externalFiles || files).map((f: any) => {
        if (withCropper) return cropUrl;
        return f.preview;
    });

    const getBackgroundStyles = () => {
        if (!changed && imagePath && imagePath !== "")
            return {
                backgroundImage: `url(${imagePath})`,
            };
        if (thumb.length > 0)
            return {
                backgroundImage: `url(${thumb[0]})`,
            };

        return {
            backgroundImage: `url(${imageTemp}`,
            backgroundSize: "auto",
        };
    };
    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            // files.forEach((f: any) => URL.revokeObjectURL(f.preview));
            setCropUrl("");
            setCropperFile(undefined);
        },
        [files]
    );

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }

        if (files.length > 0) {
            setFiles([]);
        }

        isChanged(true);
    };

    return (
        <section className="app-uploader">
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div className="image-container" style={getBackgroundStyles()}>
                    {thumb.length > 0 || imagePath ? (
                        <AppButton
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirmation) {
                                    setShowConfirmModal(true);
                                } else {
                                    handleDelete();
                                }
                            }}
                        >
                            <i className="fak fa-trash-light"></i>
                        </AppButton>
                    ) : null}
                </div>
            </div>

            {thumbs.length > 1 && (
                <>
                    <aside className="dropzone-thumbs-container">
                        {thumbs}
                    </aside>
                    <div className="accepted-rejected">
                        {/* <div>{acceptedFiles.length > 0 && "Accepted:"}</div> */}
                        {/* <ul>{acceptedFileItems}</ul> */}
                        <div className="rejected">
                            {fileRejectionItems.length > 0 && "Rejected:"}
                        </div>
                        <ul>{fileRejectionItems}</ul>
                    </div>
                </>
            )}
            {acceptedFiles.length > 0 && (
                <div className="d-flex w-100 justify-content-start">
                    {withCropper && (
                        <AppCropper
                            show={showCropModal}
                            image={files}
                            fileInfo={fileInfo}
                            handleClose={() => {
                                setShowCropModal(false);
                                setCropUrl("");
                                setFiles([]);
                            }}
                            handleSave={(url) => {
                                setShowCropModal(false);
                                setCropUrl(url);
                            }}
                            handleBlob={(blob, name, type) => {
                                setCropperFile(blob);

                                const file = new File([blob], name, {
                                    type,
                                });
                                onFileSelect([file]);
                            }}
                            cropperOptions={cropperOptions}
                        />
                    )}
                </div>
            )}
            {confirmation ? (
                <AppModal
                    show={showConfirmModal}
                    title={confirmation.title}
                    handleClose={() => {
                        setShowConfirmModal(false);
                    }}
                    handleDelete={() => {
                        handleDelete();
                        setShowConfirmModal(false);
                    }}
                    bodyContent={confirmation.bodyContent}
                />
            ) : null}
        </section>
    );
};
