import React, { FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FileTypeInfo, SimpleObject } from "../../models";
import { AppButton } from "../AppButton";
import { bytesToSize } from "../AppUploader/bytes-to-size";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_SESSION_DOC },
} = UPLOAD;

export interface AppDocsProps {
    onFileSelect?: (files: File[]) => void;
    onRemoveDoc?: (index: number) => void;
    files: SimpleObject<string>[];
    showAddDelete?: boolean;
}

export const AppDocs: FC<AppDocsProps> = ({
    onFileSelect,
    onRemoveDoc,
    files,
    showAddDelete = false,
}): JSX.Element => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sessionDocPath = useBuildAssetPath(
        FILETYPEINFO_SESSION_DOC as FileTypeInfo
    );

    async function handleFileSelection() {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    async function uploadFile(e: any) {
        if (onFileSelect) onFileSelect(e.target.files);
    }
    const getType = (name: string): string => {
        return name.substr(name.lastIndexOf(".") + 1);
    };
    const renderFiles = () => {
        return (
            files &&
            Object.keys(files).map((e, i) => {
                return (
                    <div
                        key={i}
                        className={`app-docs--container--item ${getType(
                            files[parseInt(e, 10)].name
                        )} py-2`}
                    >
                        <a
                            href={`${sessionDocPath}/${
                                files[parseInt(e, 10)].fileName
                            }`}
                        >
                            <div className="doc-row">
                                <i className="doc-icon">
                                    {getType(
                                        files[parseInt(e, 10)].name
                                    ).toUpperCase()}
                                </i>
                                <div className="doc-title">
                                    <h3>{files[parseInt(e, 10)].name}</h3>
                                    <p>
                                        {bytesToSize(
                                            parseInt(
                                                files[parseInt(e, 10)].size,
                                                10
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        </a>
                        <a
                            target="_blank"
                            href={`${sessionDocPath}/${
                                files[parseInt(e, 10)].fileName
                            }`}
                            className="btn-delete btn-secondary btn "
                        >
                            <i className="fa fa-arrow-down"></i>
                        </a>
                        {showAddDelete && (
                            <AppButton
                                onClick={() => {
                                    if (onRemoveDoc) onRemoveDoc(i);
                                }}
                                variant="secondary"
                                className="btn-delete "
                            >
                                <i className="fak fa-trash-light"></i>
                            </AppButton>
                        )}
                    </div>
                );
            })
        );
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
                                <i className="fak fa-documents mr-2"></i>
                                {t("session.form:label.documents")}
                            </h3>
                        </div>
                        {showAddDelete && (
                            <div className="app-docs--header--button col-auto mr-0 ml-auto px-0">
                                <AppButton
                                    onClick={handleFileSelection}
                                    variant="secondary"
                                    className=" add-btn"
                                >
                                    <i className="fak fa-plus-light"></i>
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
