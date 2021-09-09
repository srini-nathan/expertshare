import React, { FC } from "react";
import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./assets/scss/style.scss";
import { AppButton } from "../AppButton";
import { PExhibitorProductDoc } from "../../../AdminModule/models";
import { useBuildAssetPath } from "../../hooks";
import { ExhibitorDocFileInfo } from "../../../config";

interface AppDocDownloadProps {
    show: boolean;
    handleClose: (show: boolean) => void;
    docs: PExhibitorProductDoc[];
    title?: string;
    icon?: string;
}

export const AppDocDownload: FC<AppDocDownloadProps> = ({
    show,
    handleClose,
    docs,
    title = "admin.exhibitorProduct:popup.documents",
    icon = "documents",
}): JSX.Element => {
    const { t } = useTranslation();
    const docBasePath = useBuildAssetPath(ExhibitorDocFileInfo);
    const getType = (name: string): string => {
        return name.substr(name.lastIndexOf(".") + 1);
    };

    return (
        <React.Fragment>
            {show && (
                <div className="edit-users--popup show-users">
                    <div className="edit-users--popup--container w-100">
                        <div className="header p-3">
                            <div className="row m-0 p-0">
                                <div className="header--title col-auto pl-0">
                                    <h2 className="mb-0">
                                        <i
                                            className={`fak fa-${icon} mr-2`}
                                        ></i>
                                        {t(title)}
                                    </h2>
                                </div>
                                <div className="header--close col-auto mr-0 ml-auto pr-0">
                                    <AppButton
                                        onClick={() => {
                                            handleClose(false);
                                        }}
                                        variant="secondary"
                                    >
                                        <i className="fak fa-times-light"></i>
                                    </AppButton>
                                </div>
                            </div>
                        </div>
                        <div className="content">
                            <Row className="m-0 content--inner">
                                {docs.map((doc: PExhibitorProductDoc, i) => {
                                    if (doc.name && doc.fileName) {
                                        return (
                                            <div className="content--inner--item">
                                                <Row className="m-0 pr-2">
                                                    <div
                                                        key={i}
                                                        className={`col-12 create-session--docs--container--item ${getType(
                                                            doc?.name
                                                        )} py-2`}
                                                    >
                                                        <a
                                                            href={`${docBasePath}/${doc.fileName}`}
                                                        >
                                                            <div className="doc-row">
                                                                <i className="doc-icon">
                                                                    {getType(
                                                                        doc.name
                                                                    ).toUpperCase()}
                                                                </i>
                                                                <div className="doc-title">
                                                                    {doc.name}
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a
                                                            target="_blank"
                                                            href={`${docBasePath}/${doc.fileName}`}
                                                            className="btn-delete btn-secondary btn "
                                                        >
                                                            <i className="fa fa-arrow-down"></i>
                                                        </a>
                                                    </div>
                                                </Row>
                                            </div>
                                        );
                                    }
                                    return <></>;
                                })}
                            </Row>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};
