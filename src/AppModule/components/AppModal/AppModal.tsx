import React, { FC } from "react";

import { Button, Modal } from "react-bootstrap";
import "./assets/scss/style.scss";

interface AppModalProps {
    show: boolean;
    handleClose: () => void;
    handleDelete: () => void;
    title?: string;
    bodyContent?: any;
}
export const AppModal: FC<AppModalProps> = ({
    show,
    handleClose,
    handleDelete,
    bodyContent,
    title = "Delete Action",
}): JSX.Element => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyContent}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
