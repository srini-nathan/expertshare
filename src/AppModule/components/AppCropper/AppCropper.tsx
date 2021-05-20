import React, { FC, useState } from "react";
import Cropper from "react-cropper";
import { Modal } from "react-bootstrap";
import InputRange from "react-input-range";
import { AppButton } from "../AppButton";

import "./assets/scss/style.scss";
// eslint-disable-next-line import/no-extraneous-dependencies
import "cropperjs/dist/cropper.css";
import "react-input-range/lib/css/index.css";

interface AppCropperProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (url: string) => void;
    handleBlob: (blog: any) => void;
    title?: string;
    image?: any;
    initialAspectRatio: number;
    maxZoomLevel?: number;
}

export const AppCropper: FC<AppCropperProps> = ({
    image,
    show,
    handleClose,
    handleSave,
    handleBlob,
    title = "Crop Image",
    initialAspectRatio,
    maxZoomLevel = 5,
}): JSX.Element => {
    const [cropper, setCropper] = useState<Cropper>();
    const [zoomValue, setZoomValue] = useState<number>(0);

    const onCrop = () => {
        if (typeof cropper !== "undefined") {
            cropper.getCroppedCanvas().toBlob(
                (blob: any) => {
                    handleBlob(blob);
                    handleSave(URL.createObjectURL(blob));
                },
                "image/jpeg",
                0.75
            );
        }
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
                        // Cropper.js options
                        initialAspectRatio={initialAspectRatio}
                        viewMode={2}
                        guides={false}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
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
                <AppButton variant="primary" onClick={onCrop}>
                    <i className="fas fa-check white"></i>
                    <span className="text-cancel">Done</span>
                </AppButton>
            </Modal.Footer>
        </Modal>
    );
};
