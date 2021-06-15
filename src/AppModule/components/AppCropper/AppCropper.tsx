import React, { FC, useState } from "react";
import Cropper from "react-cropper";
import { Modal } from "react-bootstrap";
import InputRange from "react-input-range";
import { AppButton } from "../AppButton";

import "./assets/scss/style.scss";
import "cropperjs/dist/cropper.css";
import "react-input-range/lib/css/index.css";
import { FileTypeInfo } from "../../models";

type Options = Cropper.Options;

interface AppCropperProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (url: string) => void;
    handleBlob: (blog: any) => void;
    title?: string;
    image?: any;
    maxZoomLevel?: number;
    cropperOptions?: Options;
    fileInfo: FileTypeInfo;
}

export const AppCropper: FC<AppCropperProps> = ({
    image,
    show,
    handleClose,
    handleSave,
    handleBlob,
    title = "Crop Image",
    maxZoomLevel = 5,
    cropperOptions,
    fileInfo,
}): JSX.Element => {
    const [cropper, setCropper] = useState<Cropper>();
    const [zoomValue, setZoomValue] = useState<number>(0);

    const { ratio, width, height } = fileInfo;

    const onCrop = (type = "image/jpeg") => {
        if (typeof cropper !== "undefined") {
            cropper.getCroppedCanvas().toBlob(
                (blob: any) => {
                    handleBlob(blob);
                    handleSave(URL.createObjectURL(blob));
                },
                type,
                0.75
            );
        }
    };
    const getRatio = (): number => {
        const ratios = ratio?.split("/");
        if (ratios && ratios.length > 0)
            return parseInt(ratios[0], 10) / parseInt(ratios[1], 10);
        return 16 / 9;
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            className="cropper-modal-dialog"
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {image.length > 0 && (
                    <Cropper
                        src={image[0].preview}
                        style={{ height: 400, width: "100%" }}
                        aspectRatio={getRatio()}
                        cropBoxResizable={false}
                        autoCropArea={1}
                        width={parseInt(width as string, 10)}
                        height={parseInt(height as string, 10)}
                        dragMode="move"
                        viewMode={2}
                        guides={false}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                        {...cropperOptions}
                    />
                )}
            </Modal.Body>
            <Modal.Footer>
                <AppButton
                    variant="secondary"
                    onClick={() => {
                        cropper?.rotate(-90);
                    }}
                >
                    <i className="fa fa-rotate-left"></i>
                </AppButton>
                <AppButton
                    variant="secondary"
                    onClick={() => {
                        cropper?.rotate(+90);
                    }}
                >
                    <i className="fa fa-rotate-right"></i>
                </AppButton>

                <AppButton
                    variant="secondary"
                    disabled={zoomValue === 0}
                    className="btn-minus"
                    onClick={() => {
                        setZoomValue(
                            zoomValue > 0 ? zoomValue - 0.1 : maxZoomLevel
                        );
                        cropper?.zoom(zoomValue > 0 ? -0.1 : maxZoomLevel);
                    }}
                >
                    <i className="fas fa-minus"></i>
                </AppButton>
                <InputRange
                    maxValue={5}
                    minValue={0}
                    step={0.1}
                    value={zoomValue}
                    onChange={(value: any) => {
                        setZoomValue(Number(value.toFixed(1)));
                        cropper?.zoomTo(value.toFixed(1));
                    }}
                />
                <AppButton
                    variant="secondary"
                    className="btn-plus"
                    disabled={zoomValue === maxZoomLevel}
                    onClick={() => {
                        setZoomValue(
                            zoomValue < maxZoomLevel
                                ? zoomValue + 0.1
                                : maxZoomLevel
                        );
                        cropper?.zoom(
                            zoomValue < maxZoomLevel ? +0.1 : maxZoomLevel
                        );
                    }}
                >
                    {/* @TODO: Ask Yauheni to use AppIcon everywhere, where we're using icons */}
                    <i className="fas fa-plus"></i>
                </AppButton>
                <AppButton
                    variant="secondary"
                    onClick={() => {
                        cropper?.reset();
                        setZoomValue(0);
                    }}
                >
                    <i className="fa fa-rotate-right"></i>
                    <span className="text-reset">Reset</span>
                </AppButton>
                <AppButton variant="secondary" onClick={handleClose}>
                    <i className="fas fa-times"></i>
                    <span className="text-cancel">Cancel</span>
                </AppButton>
                <AppButton
                    variant="primary"
                    onClick={() => {
                        if (image.length > 0) onCrop(image[0]);
                    }}
                >
                    <i className="fas fa-check white"></i>
                    <span className="text-cancel">Done</span>
                </AppButton>
            </Modal.Footer>
        </Modal>
    );
};
