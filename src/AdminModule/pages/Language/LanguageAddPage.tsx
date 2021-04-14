import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { AppPageHeader, AppSwitch } from "../../../AppModule/components";
import { AppBreadcrumb } from "../../../AppModule/components/AppBreadcrumb";
import { AppButton } from "../../../AppModule/components/AppButton";

export const LanguageAddPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

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
                                    placeholder="First name"
                                    defaultValue="Mark"
                                />
                                <Form.Control.Feedback>
                                    Looks good!
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
                                    placeholder="Last name"
                                    defaultValue="Otto"
                                />
                                <Form.Control.Feedback>
                                    Looks good!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                                as={Col}
                                md="4"
                                controlId="validationCustom02"
                            >
                                <Form.Label>Active</Form.Label>
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
