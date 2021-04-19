import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { AppPageHeader, AppSwitch } from "../../../AppModule/components";
import { AppBreadcrumb } from "../../../AppModule/components/AppBreadcrumb";
import { AppButton } from "../../../AppModule/components/AppButton";
import { LanguageEntity } from "../../models";
import { LanguageApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";
import { handleCommonAPIErrors } from "../../../AppModule/utils/api-error-handling";

export const LanguageAddPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { id } = useParams();
    const isEditMode = !!id;

    const [validated, setValidated] = useState(false);
    const [data, setData] = useState<LanguageEntity>(new LanguageEntity());

    const saveData = () => {
        if (isEditMode) {
            LanguageApi.update<LanguageEntity, LanguageEntity>(id, data)
                .then(() => {
                    successToast("Language created");
                })
                .catch((e: Error) => {
                    const handled = handleCommonAPIErrors(e);
                    if (!handled) {
                        errorToast(e.message);
                    }
                });
        } else {
            LanguageApi.create<LanguageEntity, LanguageEntity>(data)
                .then(() => {
                    successToast("Language created");
                })
                .catch((e: Error) => {
                    const handled = handleCommonAPIErrors(e);
                    if (!handled) {
                        errorToast(e.message);
                    }
                });
        }
    };

    const handleChange = (name: string, value: string | number | boolean) => {
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            saveData();
        }

        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
    };

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Language"} linkUrl={".."} />
            <AppPageHeader title={"Add Language"} />
            <Row>
                <Col>
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <Form.Row>
                            <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom01"
                            >
                                <Form.Label>Language</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter Language"
                                    defaultValue={data.name}
                                    onChange={(e) =>
                                        handleChange(
                                            "name",
                                            e.currentTarget.value
                                        )
                                    }
                                />
                                <Form.Control.Feedback type={"invalid"}>
                                    This is error
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom02"
                            >
                                <Form.Label>Locale</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter Locale"
                                    defaultValue={data.locale}
                                    onChange={(e) =>
                                        handleChange(
                                            "locale",
                                            e.currentTarget.value
                                        )
                                    }
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                                <Form.Label>Is Active ?</Form.Label>
                                <AppSwitch
                                    id={"is-active"}
                                    name={"isActive"}
                                    value={true}
                                ></AppSwitch>
                            </Form.Group>
                        </Form.Row>
                        {/* @TODO: Move it to FormAction component */}
                        <div>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <AppButton
                                    type="button"
                                    variant={"outline-primary"}
                                    className="mr-4"
                                >
                                    Cancel
                                </AppButton>
                                <AppButton type="submit">Save</AppButton>
                            </div>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
