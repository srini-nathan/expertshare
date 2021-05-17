import React, { FC, useState } from "react";
import Cropper from "react-cropper";
import { Button, Modal } from "react-bootstrap";
import RotateLeft from "./assets/images/Rotate-Left.svg";
import RotateRight from "./assets/images/Rotate-Right.svg";
import Minus from "./assets/images/minus.svg";
import Plus from "./assets/images/plus.svg";
import "./assets/scss/style.scss";
// eslint-disable-next-line import/no-extraneous-dependencies
import "cropperjs/dist/cropper.css";

interface AppCropperProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (url: string) => void;
    title?: string;
    image?: any;
}

export const AppCropper: FC<AppCropperProps> = ({
    image,
    show,
    handleClose,
    handleSave,
    title = "Crop Image",
}): JSX.Element => {
    const [cropper, setCropper] = useState<any>();

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
        <div>
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
                            initialAspectRatio={16 / 9}
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
                            cropper.rotate(+90);
                        }}
                    >
                        <img src={RotateLeft}></img>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            cropper.rotate(-90);
                        }}
                    >
                        <img src={RotateRight}></img>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            cropper.zoom(+0.1);
                        }}
                    >
                        <img src={Plus}></img>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            cropper.zoom(-0.1);
                        }}
                    >
                        <img src={Minus}></img>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            cropper.reset();
                        }}
                    >
                        <img src={RotateRight}></img>
                        <span className="text-reset">Reset</span>
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onCrop}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
