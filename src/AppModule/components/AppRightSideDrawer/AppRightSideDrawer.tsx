import React, { FC } from "react";
// import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import "./assets/scss/style.scss";

interface AppRightSideDrawerProps {
    show: boolean;
    handleClose: () => void;
    handleDelete: () => void;
    title: string;
    bodyContent: any;
}

export const AppRightSideDrawer: FC<AppRightSideDrawerProps> = ({
    show,
    handleClose,
    bodyContent,
    title,
}): JSX.Element => {
    // const { t } = useTranslation();

    return (
        <Modal
            show={show}
            onHide={() => handleClose}
            backdrop="static"
            keyboard={false}
            className="filter-drawer"
        >
            <Modal.Header>
                <Modal.Title>{title} </Modal.Title>
                <button type="button" className="close">
                    <i className="fak fa-times-light" onClick={handleClose}></i>
                </button>
            </Modal.Header>
            <Modal.Body>{bodyContent}</Modal.Body>
        </Modal>
    );
};
