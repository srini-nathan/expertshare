import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Form, Row } from "react-bootstrap";
import { Exhibitor, SExhibitorTranslation } from "../../models";
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
        setActiveLocale,
        data,
        languages,
        hookForm,
    } = useDataAddEdit<Exhibitor>(new Exhibitor());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const logoBasePath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);

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
                                setValue={hookForm.setValue}
                                activeLocale={activeLocale}
                                formState={hookForm.formState}
                                register={hookForm.register}
                                isEditMode={isEditMode}
                                translations={
                                    data.translations as SExhibitorTranslation
                                }
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
