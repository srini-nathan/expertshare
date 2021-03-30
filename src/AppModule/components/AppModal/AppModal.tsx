import React, { FC } from "react";

import { Button, Modal } from "react-bootstrap";

interface AppModalProps {
    show: boolean;
    handleClose: () => void;
    handleDelete: () => void;
    id: number;
}
export const AppModal: FC<AppModalProps> = ({
    show,
    handleClose,
    handleDelete,
    id,
}): JSX.Element => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Client Delete Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Area You sure you want to delete the client with id: {id}
            </Modal.Body>
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
