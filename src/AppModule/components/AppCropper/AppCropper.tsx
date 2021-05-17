import React, { FC, useState } from "react";
import Cropper from "react-cropper";
import { Button, Modal } from "react-bootstrap";
import InputRange from "react-input-range";

import RotateLeft from "./assets/images/Rotate-Left.svg";
import RotateRight from "./assets/images/Rotate-Right.svg";
import Minus from "./assets/images/minus.svg";
import Plus from "./assets/images/plus.svg";
import CloseIcon from "./assets/images/close-icon.svg";
import Done from "./assets/images/done.svg";
import "./assets/scss/style.scss";
// eslint-disable-next-line import/no-extraneous-dependencies
import "cropperjs/dist/cropper.css";
import "react-input-range/lib/css/index.css";

interface AppCropperProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (url: string) => void;
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
    title = "Crop Image",
    initialAspectRatio,
    maxZoomLevel = 5,
}): JSX.Element => {
    const [cropper, setCropper] = useState<any>();
    const [zoomValue, setZoomValue] = useState<number | any>(0);

    const onCrop = () => {
        if (typeof cropper !== "undefined") {
            cropper.getCroppedCanvas().toBlob(
                (blob: any) => {
                    // eslint-disable-next-line no-console
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
                <Button
                    variant="secondary"
                    onClick={() => {
                        cropper.rotate(-90);
                    }}
                >
                    <img src={RotateLeft}></img>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        cropper.rotate(+90);
                    }}
                >
                    <img src={RotateRight}></img>
                </Button>

                <Button
                    variant="secondary"
                    disabled={zoomValue === 0}
                    className="btn-minus"
                    onClick={() => {
                        setZoomValue(zoomValue > 0 && zoomValue - 0.1);
                        cropper.zoom(zoomValue > 0 && -0.1);
                    }}
                >
                    <img src={Minus}></img>
                </Button>
                <InputRange
                    maxValue={5}
                    minValue={0}
                    step={0.1}
                    value={zoomValue}
                    onChange={(value: any) => {
                        // eslint-disable-next-line no-console
                        // console.log(value.toFixed(1));
                        setZoomValue(Number(value.toFixed(1)));
                        cropper.zoomTo(value.toFixed(1));
                    }}
                />
                <Button
                    variant="secondary"
                    className="btn-plus"
                    disabled={zoomValue === maxZoomLevel}
                    onClick={() => {
                        setZoomValue(
                            zoomValue < maxZoomLevel && zoomValue + 0.1
                        );
                        cropper.zoom(zoomValue < maxZoomLevel && +0.1);
                    }}
                >
                    <img src={Plus}></img>
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        cropper.reset();
                        setZoomValue(0);
                    }}
                >
                    <img src={RotateRight}></img>
                    <span className="text-reset">Reset</span>
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    <img src={CloseIcon}></img>
                    <span className="text-cancel">Cancel</span>
                </Button>
                <Button variant="primary" onClick={onCrop}>
                    <img src={Done}></img>
                    <span className="text-cancel">Done</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
