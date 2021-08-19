import React, { FC, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Form, Row } from "react-bootstrap";
import { Exhibitor, ExhibitorTranslation } from "../../models";
import { useBuildAssetPath, useDataAddEdit } from "../../../AppModule/hooks";
import {
    AppCard,
    AppLoader,
    AppFormLabelTranslatable,
    AppPageHeaderTranslatable,
    AppUploader,
} from "../../../AppModule/components";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
} from "../../../config";
import "./assets/scss/style.scss";
import { ExhibitorTranslatable } from "./ExhibitorTranslatable";

export const ExhibitorAddEditPage: FC<RouteComponentProps> = (): JSX.Element => {
    const {
        isLoading,
        isEditMode,
        activeLocale,
        defaultLocale,
        setActiveLocale,
        languages,
        hookForm,
    } = useDataAddEdit<Exhibitor>(new Exhibitor());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const logoBasePath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);
    const [translations, setTranslations] = useState<ExhibitorTranslation[]>(
        []
    );

    if (isLoading) {
        return <AppLoader />;
    }

    return (
        <div className={"exhibitor-add-edit-page"}>
            <AppPageHeaderTranslatable
                title={`admin.exhibitor.form:header.${
                    isEditMode ? "editTitle" : "addTitle"
                }`}
            />
            <Form noValidate onSubmit={() => {}}>
                <Row>
                    <Col>
                        <AppCard>
                            <AppLanguageSwitcher
                                activeLocale={activeLocale}
                                onChange={setActiveLocale}
                            />
                            <ExhibitorTranslatable
                                languages={languages}
                                control={hookForm.control}
                                activeLocale={activeLocale}
                                defaultLocale={defaultLocale}
                                translations={translations}
                                onChange={setTranslations}
                            />
                            <Col className={"p-0"}>
                                <Form.Group>
                                    <AppFormLabelTranslatable
                                        label={
                                            "admin.exhibitor.form:label.logo"
                                        }
                                        required={true}
                                    />
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
                                        fileInfo={ExhibitorLogoPosterFileInfo}
                                        onFileSelect={() => {}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className={"p-0"}>
                                <Form.Group>
                                    <AppFormLabelTranslatable
                                        label={
                                            "admin.exhibitor.form:label.poster"
                                        }
                                        required={true}
                                    />
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
                                        fileInfo={ExhibitorPosterFileInfo}
                                        onFileSelect={() => {}}
                                    />
                                </Form.Group>
                            </Col>
                        </AppCard>
                    </Col>
                    <Col></Col>
                </Row>
            </Form>
        </div>
    );
};
