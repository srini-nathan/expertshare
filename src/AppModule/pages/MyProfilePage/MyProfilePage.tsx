import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Tab, Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppProfileHeader,
    AppTabWithIcon,
    AppTabs,
    AppTab,
    AppCard,
    AppFormSwitch,
    AppFormInput,
    AppFormInputPassword,
    AppFormTextArea,
    AppFormRadioSwitch,
    AppFormLabel,
    AppFormRadio,
    AppFormActions,
} from "../../components";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import { validation } from "../../utils";
import { useNavigator } from "../../hooks";

const validationSchema = Yup.object().shape({});

export const MyProfilePage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const { control, formState } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const { errors } = formState;
    const navigator = useNavigator(navigate);

    return (
        <>
            <AppProfileHeader {...user} />
            <Form>
                <Tab.Container defaultActiveKey="Feeds">
                    <Row className="m-0">
                        <AppTabWithIcon
                            className="mr-3"
                            eventKey="Feeds"
                            title="My Feeds"
                            icon="fak fa-columns-regular"
                        ></AppTabWithIcon>
                        <AppTabWithIcon
                            eventKey="Profile"
                            title="Profile"
                            icon="fak fa-user-regular"
                        ></AppTabWithIcon>
                    </Row>
                    <Tab.Pane className="mt-4 " eventKey="Profile">
                        <AppTabs defaultKeyValue="General">
                            <AppTab eventKey="General" title="General">
                                <Row className="pt-3">
                                    <Col md={12} sm={12}>
                                        <AppCard>
                                            <Form.Row>
                                                <AppFormInput
                                                    lg={6}
                                                    xl={6}
                                                    name={"first_name"}
                                                    label={"First Name"}
                                                    required={false}
                                                    {...validation(
                                                        "first_name",
                                                        formState,
                                                        true
                                                    )}
                                                    errorMessage={
                                                        errors.name?.message
                                                    }
                                                    control={control}
                                                />
                                                <AppFormInput
                                                    lg={6}
                                                    xl={6}
                                                    name={"last_name"}
                                                    label={"Last Name"}
                                                    required={false}
                                                    {...validation(
                                                        "last_name",
                                                        formState,
                                                        true
                                                    )}
                                                    errorMessage={
                                                        errors.name?.message
                                                    }
                                                    control={control}
                                                />

                                                <AppFormInput
                                                    lg={6}
                                                    xl={6}
                                                    name={"first_name"}
                                                    label={"First Name"}
                                                    required={false}
                                                    {...validation(
                                                        "first_name",
                                                        formState,
                                                        true
                                                    )}
                                                    errorMessage={
                                                        errors.name?.message
                                                    }
                                                    control={control}
                                                />
                                                <AppFormInput
                                                    lg={6}
                                                    xl={6}
                                                    name={"last_name"}
                                                    label={"Last Name"}
                                                    required={false}
                                                    {...validation(
                                                        "last_name",
                                                        formState,
                                                        true
                                                    )}
                                                    errorMessage={
                                                        errors.name?.message
                                                    }
                                                    control={control}
                                                />
                                                <AppFormSwitch
                                                    lg={6}
                                                    xl={6}
                                                    name={"switch"}
                                                    label={"Switch"}
                                                    control={control}
                                                    defaultChecked={false}
                                                />
                                                <AppFormSwitch
                                                    lg={6}
                                                    xl={6}
                                                    name={"switch"}
                                                    label={"Switch"}
                                                    control={control}
                                                    defaultChecked={false}
                                                />
                                                <AppFormRadioSwitch
                                                    name={"selector"}
                                                    defaultValue={"Anonymous"}
                                                    label={"Selector"}
                                                    control={control}
                                                    required={false}
                                                    options={[
                                                        {
                                                            value: "Anonymous",
                                                            label: "Anonymous",
                                                        },
                                                        {
                                                            value: "full_name",
                                                            label: "FullName",
                                                        },
                                                    ]}
                                                    {...validation(
                                                        "selector",
                                                        formState,
                                                        false
                                                    )}
                                                    errorMessage={
                                                        errors.storage?.message
                                                    }
                                                />
                                                <Col md={12}>
                                                    <AppFormLabel
                                                        label="Gender"
                                                        required={false}
                                                    />
                                                    <div className="d-flex">
                                                        <AppFormRadio
                                                            name={"gender"}
                                                            value="Female"
                                                            id={"selector"}
                                                            label={"Female"}
                                                        />
                                                        <AppFormRadio
                                                            name={"gender"}
                                                            id={"male"}
                                                            value="Male"
                                                            label={"Male"}
                                                        />
                                                        <AppFormRadio
                                                            name={"gender"}
                                                            id={"other"}
                                                            value="other"
                                                            label={"other"}
                                                        />
                                                    </div>
                                                </Col>
                                                <AppFormTextArea
                                                    lg={12}
                                                    xl={12}
                                                    name={"text"}
                                                    required={false}
                                                    label={"Text Area"}
                                                    {...validation(
                                                        "text",
                                                        formState,
                                                        true
                                                    )}
                                                    errorMessage={
                                                        errors.notes?.message
                                                    }
                                                    control={control}
                                                />
                                            </Form.Row>
                                        </AppCard>
                                    </Col>
                                </Row>
                            </AppTab>

                            <AppTab eventKey="Setings" title="Setings">
                                <Row className="m-0 pt-3">
                                    <AppCard title="Privacy & Communication">
                                        <Row>
                                            <AppFormSwitch
                                                lg={6}
                                                xl={6}
                                                name={"switch"}
                                                label={"Switch"}
                                                control={control}
                                                defaultChecked={false}
                                            />
                                            <AppFormSwitch
                                                lg={6}
                                                xl={6}
                                                name={"switch"}
                                                label={"Switch"}
                                                control={control}
                                                defaultChecked={false}
                                            />
                                            <AppFormSwitch
                                                lg={6}
                                                xl={6}
                                                name={"switch"}
                                                label={"Switch"}
                                                control={control}
                                                defaultChecked={false}
                                            />
                                            <AppFormSwitch
                                                lg={6}
                                                xl={6}
                                                name={"switch"}
                                                label={"Switch"}
                                                control={control}
                                                defaultChecked={false}
                                            />
                                        </Row>
                                    </AppCard>
                                </Row>
                            </AppTab>
                            <AppTab
                                eventKey="ChangePassword"
                                title="Change Password"
                            >
                                <Row className="pt-3">
                                    <Col md={12} sm={12}>
                                        <AppCard>
                                            <Row>
                                                <AppFormInputPassword
                                                    lg={6}
                                                    xl={6}
                                                    name={"last_name"}
                                                    label={"New Password"}
                                                    required={false}
                                                    {...validation(
                                                        "last_name",
                                                        formState,
                                                        true
                                                    )}
                                                    errorMessage={
                                                        errors.name?.message
                                                    }
                                                    control={control}
                                                />
                                                <AppFormInputPassword
                                                    lg={6}
                                                    xl={6}
                                                    name={"last_name"}
                                                    label={
                                                        "Confirm New Password"
                                                    }
                                                    required={false}
                                                    {...validation(
                                                        "last_name",
                                                        formState,
                                                        true
                                                    )}
                                                    errorMessage={
                                                        errors.name?.message
                                                    }
                                                    control={control}
                                                />
                                            </Row>
                                        </AppCard>
                                    </Col>
                                </Row>
                            </AppTab>
                        </AppTabs>
                    </Tab.Pane>
                </Tab.Container>
                <AppFormActions isEditMode={false} navigation={navigator} />
            </Form>
        </>
    );
};
