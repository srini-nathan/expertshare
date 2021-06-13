import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "react-bootstrap";
import "./assets/scss/style.scss";

interface AppModalProps {
    show: boolean;
    handleClose: () => void;
    handleDelete: () => void;
    title?: string;
    bodyContent: string;
}
export const AppModal: FC<AppModalProps> = ({
    show,
    handleClose,
    handleDelete,
    bodyContent,
    title = "Delete Action",
}): JSX.Element => {
    const { t } = useTranslation();

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
                    {t("common.button:no")}
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                    {t("common.button:yes")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
