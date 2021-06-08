import React, { FC, useRef } from "react";
import { SimpleObject } from "../../models";
import { AppButton } from "../AppButton";
import { bytesToSize } from "../AppUploader/bytes-to-size";

import "./assets/scss/style.scss";

export interface AppSessionDocProps {
    name?: string;
    onFileSelect: (files: File[]) => void;
    onRemoveDoc: (index: number) => void;
    files: SimpleObject<string>[];
}

export const AppSessionDoc: FC<AppSessionDocProps> = ({
    onFileSelect,
    onRemoveDoc,
    files,
}): JSX.Element => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    async function handleFileSelection() {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    async function uploadFile(e: any) {
        onFileSelect(e.target.files);
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
                        className={`create-session--docs--container--item ${getType(
                            files[parseInt(e, 10)].name
                        )} py-2`}
                    >
                        <a href="#">
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
                        <AppButton
                            onClick={() => onRemoveDoc(i)}
                            variant="secondary"
                            className="btn-delete "
                        >
                            <i className="fak fa-trash-light"></i>
                        </AppButton>
                    </div>
                );
            })
        );
    };

    return (
        <div className="create-session--docs">
            <input
                ref={fileInputRef}
                onChange={uploadFile}
                id="select-file"
                type="file"
                hidden={true}
            />

            <div className="row p-0 m-0">
                <div className="create-session--docs--header col-12 px-0">
                    <div className="row m-0 p-0">
                        <div className="create-session--docs--header--name col-auto px-0">
                            <h3>
                                <i className="fak fa-documents"></i>
                                Documents
                            </h3>
                        </div>
                        <div className="create-session--docs--header--button col-auto mr-0 ml-auto px-0">
                            <AppButton
                                onClick={handleFileSelection}
                                variant="secondary"
                                className=" add-btn"
                            >
                                <i className="fak fa-plus-light"></i>
                                Add
                            </AppButton>
                        </div>
                    </div>
                </div>

                <div className="create-session--docs--container mt-2">
                    {renderFiles()}
                </div>
            </div>
        </div>
    );
};
