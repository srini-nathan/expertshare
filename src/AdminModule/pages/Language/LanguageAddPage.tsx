import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { AppPageHeader, AppSwitch } from "../../../AppModule/components";
import { AppBreadcrumb } from "../../../AppModule/components/AppBreadcrumb";
import { AppButton } from "../../../AppModule/components/AppButton";
import { LanguageEntity } from "../../models";
import { LanguageApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { AppLoadableFallback } from "../../../AppModule/components/AppLoadableFallback";

export const LanguageAddPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const [validated, setValidated] = useState(false);
    const [data, setData] = useState<LanguageEntity>(new LanguageEntity());
    const [loading, setLoading] = useState<boolean>(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            LanguageApi.getById<LanguageEntity>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Language not exist");
                    } else if (response !== null) {
                        setData(response);
                    }
                    setLoading(false);
                }
            );
        }
    }, [id]);

    const saveData = () => {
        LanguageApi.createOrUpdate<LanguageEntity>(id, data).then(
            ({ error, isInvalid, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (
                    isInvalid &&
                    error instanceof UnprocessableEntityErrorResponse
                ) {
                    const { description } = error;
                    errorToast(description);
                } else {
                    nav("..").then(() => {
                        successToast(
                            isEditMode ? "Language updated" : "Language created"
                        );
                    });
                }
            }
        );
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

    if (loading) {
        return <AppLoadableFallback />;
    }

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Language"} linkUrl={".."} />
            <AppPageHeader
                title={isEditMode ? "Edit Language" : "Add Language"}
            />
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
                                    onClick={() => nav("..").then()}
                                >
                                    Cancel
                                </AppButton>
                                <AppButton type="submit">
                                    {isEditMode ? "Update" : "Save"}
                                </AppButton>
                            </div>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
