import React, { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FileTypeInfo } from "../../models";
import { AppButton } from "../../components/AppButton";
import { bytesToSize } from "../../components/AppUploader/bytes-to-size";
import { useBuildAssetPath } from "../../hooks";
import "./assets/scss/style.scss";
import { PExhibitorProductDoc } from "../../../AdminModule/models";

export interface AppDocsProps {
    fileTypeInfo: FileTypeInfo;
    docs: PExhibitorProductDoc[];
    onDocSelect?: (file: File) => void;
    onDocDelete?: (index: number) => void;
    enableActions?: boolean;
    title?: string;
    titleIcon?: string;
}

export const AppDocs: FC<AppDocsProps> = ({
    fileTypeInfo,
    onDocSelect,
    onDocDelete,
    docs,
    enableActions = true,
    title = "common.title:documents",
    titleIcon = "fa-plus-light",
}): JSX.Element => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const docBasePath = useBuildAssetPath(fileTypeInfo);

    async function handleFileSelection() {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (onDocSelect && e.currentTarget.files && e.currentTarget.files[0]) {
            onDocSelect(e.currentTarget.files[0]);
        }
    }
    const getType = (name: string): string => {
        return name.substr(name.lastIndexOf(".") + 1);
    };
    const renderFiles = () => {
        return docs.map((doc, i) => {
            if (doc.name && doc.fileName) {
                return (
                    <div
                        key={i}
                        className={`app-docs--container--item ${getType(
                            doc.name
                        )} py-2`}
                    >
                        <a href={`${docBasePath}/${doc.fileName}`}>
                            <div className="doc-row">
                                <i className="doc-icon">
                                    {getType(doc.name).toUpperCase()}
                                </i>
                                <div className="doc-title">
                                    <h3>{doc.name}</h3>
                                    <p>
                                        {doc?.size
                                            ? bytesToSize(
                                                  parseInt(doc.size, 10)
                                              )
                                            : ""}
                                    </p>
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
                        {enableActions && (
                            <AppButton
                                onClick={() => {
                                    if (onDocDelete) onDocDelete(i);
                                }}
                                variant="secondary"
                                className="btn-delete "
                            >
                                <i className="fak fa-trash-light"></i>
                            </AppButton>
                        )}
                    </div>
                );
            }
            return <></>;
        });
    };

    return (
        <div className="app-docs">
            <input
                ref={fileInputRef}
                onChange={uploadFile}
                id="select-file"
                type="file"
                hidden={true}
            />

            <div className="row p-0 m-0">
                <div className="app-docs--header col-12 px-0">
                    <div className="row m-0 p-0">
                        <div className="app-docs--header--name col-auto px-0">
                            <h3>
                                <i className="fak fa-documents mr-1"></i>
                                {t(title)}
                            </h3>
                        </div>
                        {enableActions && (
                            <div className="app-docs--header--button col-auto mr-0 ml-auto px-0">
                                <AppButton
                                    onClick={handleFileSelection}
                                    variant="secondary"
                                    className=" add-btn"
                                >
                                    <i className={`fak ${titleIcon} mr-2`}></i>
                                    {t("common.button:add")}
                                </AppButton>
                            </div>
                        )}
                    </div>
                </div>
                <div className="app-docs--container mt-2">{renderFiles()}</div>
            </div>
        </div>
    );
};
