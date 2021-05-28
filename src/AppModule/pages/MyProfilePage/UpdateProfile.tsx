import React, { FC, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppCard,
    AppFormInput,
    AppButton,
    AppLoader,
    AppFormSelectCreatable,
    AppFormFieldGenerator,
} from "../../components";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import {
    validation,
    errorToast,
    successToast,
    setViolations,
} from "../../utils";
import { UserApi, UserTagApi, UserFieldApi } from "../../../AdminModule/apis";
import { UserTag, UserField } from "../../../AdminModule/models";
import { UnprocessableEntityErrorResponse, SimpleObject } from "../../models";

type UpdateProfileReq = {
    [key: string]: any;
};

type UpdateProfileForm<T> = {
    [key: string]: T;
};

export const UpdateProfile: FC<RouteComponentProps> = (): JSX.Element => {
    const { state, dispatch } = React.useContext(AuthContext);
    const { user, clientId } = state as AuthState;
    const [loading, isLoading] = React.useState<boolean>(false);
    const [userTags, setUserTags] = useState<SimpleObject<string>[]>([]);
    const [selectedUserTags, setSelectedUserTag] = useState<
        SimpleObject<string>[]
    >([]);
    const [userFields, setUserFields] = useState<UserField[]>([]);

    let validationShape = {
        firstName: Yup.string().min(2).required(),
        lastName: Yup.string().min(2).required(),
    };
    userFields.forEach((e) => {
        if (e.isActive && e.isRequired)
            validationShape = {
                ...validationShape,
                [UserFieldApi.toResourceUrl(e.id)]: Yup.string().required(),
            };
    });
    const validationSchema = Yup.object().shape(validationShape);

    /* eslint-disable no-console */
    console.log(validationShape);
    /* eslint-enable no-console */
    const { control, handleSubmit, formState, setError } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const { errors } = formState;

    const fetchUserTags = () => {
        UserTagApi.find<UserTag>(1, { "client.id": clientId }).then(
            ({ error, response }) => {
                isLoading(false);
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

    useEffect(() => {
        fetchUserTags();
        const selectedTags: SimpleObject<string>[] = [];
        if (user && userTags)
            user?.userTags?.forEach((e) => {
                selectedTags.push({
                    id: `${e.id}`,
                    value: `${e.name}`,
                    label: `${e.name}`,
                });
            });
        setSelectedUserTag(selectedTags);
    }, []);

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
    }, [user]);

    const renderUserFields = () => {
        return userFields.map((e) => {
            let defaultValue: any = null;

            user?.userFieldValues?.forEach((item: any) => {
                if (e.id === item.userField.id) defaultValue = item;
            });
            return (
                <AppFormFieldGenerator
                    defaultValue={defaultValue}
                    properties={e}
                    validation={{
                        ...validation(
                            UserFieldApi.toResourceUrl(e.id),
                            formState,
                            true
                        ),
                    }}
                    control={control}
                />
            );
        });
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
            userFieldValues.push({
                value: `${value}`,
                userField: key,
            });
        });
        return userFieldValues;
    };
    const onSubmit = async (formData: UpdateProfileForm<any>) => {
        isLoading(true);
        formData.userTags = selectedUserTags.map((e) => {
            if (!e.id) return { name: e.label };
            return UserTagApi.toResourceUrl(parseInt(e.id, 10));
        });

        formData.userFieldValues = getDynamicFileds(formData.userField);
        delete formData.userField;
        if (user && user.id)
            UserApi.updateProfile<UpdateProfileReq, UpdateProfileForm<any>>(
                user.id,
                formData
            ).then(({ error, response }) => {
                isLoading(false);
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<UpdateProfileForm<any>>(error, setError);

                    errorToast(error.title);
                } else if (response !== null) {
                    const isArr = response.userTags instanceof Array;

                    if (!isArr) {
                        const userTagsToArray: SimpleObject<string>[] = [];
                        Object.keys(response.userTags).forEach(function (key) {
                            userTagsToArray.push(response.userTags[key]);
                        });
                        response.userTags = userTagsToArray;
                    }
                    successToast("Profile has been updated successfully.");
                    dispatch({
                        type: 0,
                        payload: {
                            ...state,
                            user: response,
                        },
                    });
                }
            });
    };
    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="pt-3">
                    <Col md={12} sm={12}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"firstName"}
                                    label={"First Name"}
                                    defaultValue={user?.firstName}
                                    required={true}
                                    {...validation(
                                        "firstName",
                                        formState,
                                        true
                                    )}
                                    errorMessage={errors.firstName?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"lastName"}
                                    defaultValue={user?.lastName}
                                    label={"Last Name"}
                                    required={true}
                                    {...validation("lastName", formState, true)}
                                    errorMessage={errors.lastName?.message}
                                    control={control}
                                />

                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"company"}
                                    defaultValue={user?.company}
                                    label={"Company"}
                                    required={false}
                                    {...validation("company", formState, true)}
                                    errorMessage={errors.Company?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    defaultValue={user?.jobTitle}
                                    name={"jobTitle"}
                                    label={"Job Title"}
                                    required={false}
                                    {...validation("jobTitle", formState, true)}
                                    errorMessage={errors.jobTitle?.message}
                                    control={control}
                                />
                                <Col className="p-0" md={12}>
                                    <Form.Row className="m-0">
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
                                    </Form.Row>
                                </Col>
                            </Form.Row>
                        </AppCard>
                    </Col>
                    <Col md={12}>
                        <AppCard>
                            <Row>
                                {renderUserFields()}

                                <Col
                                    md={12}
                                    className="justify-content-end d-flex"
                                >
                                    {loading ? (
                                        <AppLoader containerClassName="custom-btn-loader" />
                                    ) : (
                                        <AppButton
                                            variant="primary"
                                            type="submit"
                                        >
                                            Save
                                        </AppButton>
                                    )}
                                </Col>
                            </Row>
                        </AppCard>
                    </Col>
                </Row>
            </Form>
        </>
    );
};
