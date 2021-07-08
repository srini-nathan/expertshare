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

export interface AppModalRef {
    title: string;
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
            className="confirmation-modal-dialog"
        >
            <Modal.Header closeButton>
                <svg
                    width="77"
                    height="74"
                    viewBox="0 0 77 74"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M41.2411 43.7864V38.5556C45.2133 38.5556 48.4334 35.0428 48.4334 30.7094C48.4334 26.3761 45.2133 22.8633 41.2411 22.8633C37.269 22.8633 34.0488 26.3761 34.0488 30.7094"
                        stroke="#A0B2C0"
                        stroke-width="3"
                    ></path>
                    <path
                        d="M42.4594 48.066C42.4594 48.6721 41.968 49.1635 41.3619 49.1635C40.7557 49.1635 40.2643 48.6721 40.2643 48.066C40.2643 47.4598 40.7557 46.9684 41.3619 46.9684C41.968 46.9684 42.4594 47.4598 42.4594 48.066Z"
                        fill="#A0B2C0"
                        stroke="#A0B2C0"
                        stroke-width="0.895833"
                    ></path>
                    <circle
                        cx="41"
                        cy="36"
                        r="34"
                        stroke="#A0B2C0"
                        stroke-width="3"
                    ></circle>
                    <circle
                        opacity="0.2"
                        cx="34"
                        cy="40"
                        r="34"
                        fill="#A0B2C0"
                    ></circle>
                </svg>
            </Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.Body>{bodyContent}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    <i className="fak fa-times-light"></i>
                    {t("common.button:no")}
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                    <i className="fak fa-check-regular-bold"></i>
                    {t("common.button:yes")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
