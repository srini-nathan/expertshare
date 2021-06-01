import React, { FC, Fragment, useState, useEffect, useRef } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { find as _find, isString as _isString } from "lodash";
import { Canceler } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppFormInput,
    AppFormInputPassword,
    AppFormSelect,
    AppFormSelectCreatable,
    AppTagSelect,
    AppFormSwitch,
    AppFormLabel,
    AppFormFieldGenerator,
} from "../../../AppModule/components";
import { User, UserGroup, UserTag, UserField } from "../../models";
import { UserApi, UserTagApi, UserGroupApi, UserFieldApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import {
    UnprocessableEntityErrorResponse,
    PrimitiveObject,
    SimpleObject,
} from "../../../AppModule/models";
import {
    useParamId,
    useNavigator,
    useAuthState,
    useRoles,
} from "../../../AppModule/hooks";
import { schema } from "./schema";
import { CONSTANTS } from "../../../config";

const { TIMEZONE } = CONSTANTS.User;

const options = TIMEZONE.map((value: string) => ({
    value,
    label: value,
}));

type UpdateProfileForm<T> = {
    [key: string]: T;
};

export const UserAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const { clientId: storageClientId, role } = useAuthState();
    const { clientId = storageClientId } = useParams();
    const { filterRoles, getRoles } = useRoles();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const [data, setData] = useState<User>(new User(containerResourceId));
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const cancelTokenSourceRef = useRef<Canceler>();
    const [userGroups, setUserGroups] = React.useState<SimpleObject<string>[]>(
        []
    );
    const [selectedUserTags, setSelectedUserTag] = useState<
        SimpleObject<string>[]
    >([]);
    const [selectedUserGroups, setSelectedUserGroups] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [userTags, setUserTags] = useState<SimpleObject<string>[]>([]);
    const [userFields, setUserFields] = useState<UserField[]>([]);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        setValue,
    } = useForm<User>({
        resolver: yupResolver(schema(isEditMode)),
        mode: "all",
    });

    const getRolesOption = () => {
        const FilterRoute = filterRoles(role);

        return FilterRoute.map((e: any) => {
            return {
                value: e["@id"],
                label: e.name,
            };
        });
    };
    const getUserRole = () => {
        if (isEditMode) {
            let userRole: any = {};
            getRoles().forEach((e: any) => {
                if (e.role === data.roles[0])
                    userRole = {
                        value: e["@id"],
                        label: e.name,
                    };
            });
            return userRole;
        }
        return {};
    };
    const getDynamicFileds = (userField: any[]) => {
        const userFieldValues: any[] = [];

        Object.keys(userField).forEach((key: any) => {
            let value: any = userField[key];

            if (value instanceof Date) value = value.toISOString().slice(0, 10);
            else if (value instanceof Object)
                value = JSON.stringify(
                    Object.keys(value).filter((item) => value[item])
                );
            else if (value === undefined) value = "false";

            if (
                isEditMode &&
                data.userFieldValues &&
                data.userFieldValues?.length > 0
            ) {
                let found = false;
                data.userFieldValues?.forEach((e: any) => {
                    if (e.userField["@id"] === key) {
                        userFieldValues.push({
                            "@id": `/api/user_field_values/${e.id}`,
                            value: `${value}`,
                        });
                        found = true;
                    }
                });

                if (!found) {
                    userFieldValues.push({
                        value: `${value}`,
                        userField: key,
                    });
                }
            } else
                userFieldValues.push({
                    value: `${value}`,
                    userField: key,
                });
        });
        return userFieldValues;
    };
    const onSubmit = (formData: UpdateProfileForm<any>) => {
        const userGroupsSelectedItems = selectedUserGroups.map((e) => {
            return UserGroupApi.toResourceUrl(parseInt(e.id, 10));
        });
        formData.userTags = selectedUserTags.map((e) => {
            if (!e.id) return { name: e.label };
            return UserTagApi.toResourceUrl(parseInt(e.id, 10));
        });
        formData.userGroups = userGroupsSelectedItems;
        formData.image_name = "";
        formData.source = "SOURCE_CREATE";
        formData.status = "active";

        formData.userFieldValues = getDynamicFileds(formData.userField);
        delete formData.userField;

        if (isEditMode)
            UserApi.replace<User, UpdateProfileForm<any>>(id, formData).then(
                ({ error, errorMessage }) => {
                    if (error instanceof UnprocessableEntityErrorResponse) {
                        setViolations<User>(error, setError);
                    } else if (errorMessage) {
                        errorToast(errorMessage);
                    } else {
                        navigator("..").then(() => {
                            successToast("User updated");
                        });
                    }
                }
            );
        else
            UserApi.create<User, UpdateProfileForm<any>>(formData).then(
                ({ error, errorMessage }) => {
                    if (error instanceof UnprocessableEntityErrorResponse) {
                        setViolations<User>(error, setError);
                    } else if (errorMessage) {
                        errorToast(errorMessage);
                    } else {
                        navigator("..").then(() => {
                            successToast("User created");
                        });
                    }
                }
            );
    };
    const fetchUserTags = () => {
        UserTagApi.find<UserTag>(1, { "client.id": clientId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    const tags: SimpleObject<string>[] = [];
                    response.items.forEach((e) => {
                        tags.push({
                            id: `${e.id}`,
                            value: e.name,
                            label: e.name,
                        });
                    });
                    setUserTags(tags);
                }
            }
        );
    };
    const fetchUserFields = () => {
        UserFieldApi.find<UserField>(1, { "client.id": clientId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setUserFields(response.items);
                }
            }
        );
    };
    useEffect(() => {
        fetchUserFields();
    }, [data]);
    useEffect(() => {
        fetchUserTags();
        UserGroupApi.find<UserGroup>(1, { "client.id": clientId }, (c) => {
            cancelTokenSourceRef.current = c;
        }).then(({ response, error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setUserGroups(
                    response.items.map((user) => {
                        return {
                            label: user.name,
                            value: `${user.id}`,
                            id: `${user.id}`,
                        };
                    })
                );
            }
        });
        const cancelPendingCall = cancelTokenSourceRef.current;
        return () => {
            if (cancelPendingCall) {
                cancelPendingCall();
            }
        };
    }, []);
    useEffect(() => {
        if (isEditMode) {
            UserApi.findById<User>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("User not exist");
                    } else if (response !== null) {
                        setData(response);
                        const selectedTags: SimpleObject<string>[] = [];
                        response?.userTags?.forEach((e: any) => {
                            selectedTags.push({
                                id: `${e.id}`,
                                value: `${e.name}`,
                                label: `${e.name}`,
                            });
                        });
                        setSelectedUserTag(selectedTags);
                        const selectedGroups: SimpleObject<string>[] = [];
                        response?.userGroups?.forEach((e: any) => {
                            selectedGroups.push({
                                id: `${e.id}`,
                                value: `${e.name}`,
                                label: `${e.name}`,
                            });
                        });
                        setSelectedUserGroups(selectedGroups);

                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    const renderUserFields = () => {
        return userFields.map((e) => {
            let defaultValue: any = null;
            data.userFieldValues?.forEach((item: any) => {
                if (e.id === item.userField.id) defaultValue = item;
            });
            return (
                <AppFormFieldGenerator
                    defaultValue={defaultValue}
                    properties={e}
                    setValue={setValue}
                    control={control}
                    validation={{
                        ...validation(
                            UserFieldApi.toResourceUrl(e.id),
                            formState,
                            isEditMode
                        ),
                    }}
                />
            );
        });
    };

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Users"} linkUrl={".."} />
            <AppPageHeader title={isEditMode ? "Edit User" : "Add User"} />
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md={12}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"firstName"}
                                    label={"First Name"}
                                    defaultValue={data.firstName}
                                    required={true}
                                    {...validation(
                                        "firstName",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.firstName?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"lastName"}
                                    defaultValue={data.lastName}
                                    label={"Last Name"}
                                    required={true}
                                    {...validation(
                                        "lastName",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.lastName?.message}
                                    control={control}
                                />

                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"company"}
                                    defaultValue={data.company}
                                    label={"Company"}
                                    required={true}
                                    {...validation(
                                        "company",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.company?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    defaultValue={data.jobTitle}
                                    name={"jobTitle"}
                                    label={"Job Title"}
                                    required={true}
                                    {...validation(
                                        "jobTitle",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.jobTitle?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    defaultValue={data.email}
                                    name={"email"}
                                    label={"Email"}
                                    required={true}
                                    {...validation(
                                        "email",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.email?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    defaultValue={data.locale}
                                    name={"locale"}
                                    label={"Locale"}
                                    required={true}
                                    {...validation(
                                        "locale",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.locale?.message}
                                    control={control}
                                />
                                {!isEditMode && [
                                    <AppFormInputPassword
                                        lg={6}
                                        className="mb-0"
                                        xl={6}
                                        name={"plainPassword"}
                                        label={"Password"}
                                        required={true}
                                        {...validation(
                                            "plainPassword",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.plainPassword?.message
                                        }
                                        control={control}
                                    />,
                                    <AppFormInputPassword
                                        lg={6}
                                        xl={6}
                                        className="mb-0"
                                        name={"confirmPassword"}
                                        label={"Confirm Password"}
                                        required={true}
                                        {...validation(
                                            "confirmPassword",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.confirmPassword?.message
                                        }
                                        control={control}
                                    />,
                                ]}

                                <AppFormSelect
                                    id={"role"}
                                    name={"role"}
                                    label={"Select Role"}
                                    md={12}
                                    className="role-container"
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    {...validation(
                                        "role",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultValue={getUserRole()}
                                    placeholder={"Role"}
                                    errorMessage={errors.role?.message}
                                    options={getRolesOption()}
                                    control={control}
                                    transform={{
                                        output: (template: PrimitiveObject) =>
                                            template?.value,
                                        input: (value: string) => {
                                            return _find([], {
                                                value,
                                            });
                                        },
                                    }}
                                />
                                <AppFormSelectCreatable
                                    name="userTags"
                                    label={"User Tags"}
                                    md={12}
                                    sm={12}
                                    lg={12}
                                    xl={12}
                                    id="where-filter"
                                    onChangeHandler={setSelectedUserTag}
                                    value={selectedUserTags}
                                    options={userTags}
                                    control={control}
                                />
                                <Col className="mb-4" md={12}>
                                    <AppTagSelect
                                        options={userGroups}
                                        selectedItems={selectedUserGroups}
                                        label="User Groups"
                                        onChange={(item) => {
                                            let index = -1;
                                            selectedUserGroups.filter(
                                                (e, i) => {
                                                    if (e.id === item.id) {
                                                        index = i;
                                                    }
                                                    return e;
                                                }
                                            );
                                            if (index !== -1) {
                                                setSelectedUserGroups([
                                                    ...selectedUserGroups.slice(
                                                        0,
                                                        index
                                                    ),
                                                    ...selectedUserGroups.slice(
                                                        index + 1
                                                    ),
                                                ]);
                                            } else {
                                                setSelectedUserGroups([
                                                    ...selectedUserGroups,
                                                    item,
                                                ]);
                                            }
                                        }}
                                    ></AppTagSelect>
                                </Col>
                                <AppFormSelect
                                    id={"timezone"}
                                    name={"timezone"}
                                    label={"Select Timezone"}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                    required={true}
                                    {...validation(
                                        "timezone",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultValue={{
                                        value: data?.timezone,
                                        label: data?.timezone,
                                    }}
                                    placeholder={"Timezone"}
                                    errorMessage={errors.timezone?.message}
                                    options={options}
                                    control={control}
                                    transform={{
                                        output: (template: PrimitiveObject) =>
                                            template?.value,
                                        input: (value: string) => {
                                            return _find([], {
                                                value,
                                            });
                                        },
                                    }}
                                />
                                <AppFormSwitch
                                    id={"isBlocked"}
                                    name={"isBlocked"}
                                    label={"Is Blocked"}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                    required={true}
                                    {...validation(
                                        "isBlocked",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isBlocked}
                                    errorMessage={errors.isBlocked?.message}
                                    control={control}
                                />
                                <Col md={12}>
                                    <hr />
                                </Col>
                                <Col md={12} lg={6} xl={6}>
                                    <AppFormLabel
                                        label={`Source: ${data?.source}`}
                                        required={false}
                                    />
                                </Col>
                                <Col md={12} lg={6} xl={6}>
                                    <AppFormLabel
                                        label={`Is Onboarded: ${
                                            data?.isOnboarded ? "Yes" : "No"
                                        }`}
                                        required={false}
                                    />
                                </Col>

                                {data?.lastLoginAt && (
                                    <Col className="mt-3" md={12} lg={6} xl={6}>
                                        <AppFormLabel
                                            label={`Last Login: ${data?.lastLoginAt}`}
                                            required={false}
                                        />
                                    </Col>
                                )}
                                {data?.isOnboarded && (
                                    <Col className="mt-3" md={12} lg={6} xl={6}>
                                        <AppFormLabel
                                            label={`Onboarder at: ${data?.onboardedAt}`}
                                            required={false}
                                        />
                                    </Col>
                                )}
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                            />
                        </AppCard>
                    </Col>
                    {userFields.length > 0 && (
                        <Col md={12}>
                            <AppCard>
                                <Row>{renderUserFields()}</Row>
                            </AppCard>
                        </Col>
                    )}

                    <Col className={"mb-3"} md={12}>
                        <AppCard title="Privacy & Communication">
                            <Form.Row>
                                <AppFormSwitch
                                    id={"isDisplayAsGuest"}
                                    name={"isDisplayAsGuest"}
                                    label={"Is Display as Guest?"}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={true}
                                    {...validation(
                                        "isDisplayAsGuest",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isDisplayAsGuest}
                                    errorMessage={
                                        errors.isDisplayAsGuest?.message
                                    }
                                    control={control}
                                />
                                <AppFormSwitch
                                    id={"isExposeEmail"}
                                    name={"isExposeEmail"}
                                    label={"Is Expose Email?"}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={true}
                                    {...validation(
                                        "isExposeEmail",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isExposeEmail}
                                    errorMessage={errors.isExposeEmail?.message}
                                    control={control}
                                />
                                <AppFormSwitch
                                    id={"isAllowCommunication"}
                                    name={"isAllowCommunication"}
                                    label={"Is Allow Communication?"}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={true}
                                    {...validation(
                                        "isAllowCommunication",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isAllowCommunication}
                                    errorMessage={
                                        errors.isAllowCommunication?.message
                                    }
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    );
};
