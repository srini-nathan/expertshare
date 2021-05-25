import React, { FC, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { forEach as _forEach, isString as _isString } from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppCard,
    AppFormInput,
    AppButton,
    AppLoader,
    AppFormSelectCreatable,
} from "../../components";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import { validation, errorToast, successToast } from "../../utils";
import { UserApi, UserTagApi } from "../../../AdminModule/apis";
import { UserTag } from "../../../AdminModule/models";
import { UnprocessableEntityErrorResponse, SimpleObject } from "../../models";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
});

type UpdateProfileReq = {
    [key: string]: any;
};

type UpdateProfileForm = {
    firstName: string;
    lastName: string;
    company?: string;
    jobTitle?: string;
    userTags?: any;
};

export const UpdateProfile: FC<RouteComponentProps> = (): JSX.Element => {
    const { state, dispatch } = React.useContext(AuthContext);
    const { user, clientId } = state as AuthState;
    const [loading, isLoading] = React.useState<boolean>(false);
    const [userTags, setUserTags] = useState<SimpleObject<string>[]>([]);
    const [selectedUserTags, setSelectedUserTag] = useState<
        SimpleObject<string>[]
    >([]);
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
    const onSubmit = async (formData: UpdateProfileForm) => {
        isLoading(true);
        formData.userTags = selectedUserTags.map((e) => {
            if (!e.id) return { name: e.label };
            return UserTagApi.toResourceUrl(parseInt(e.id, 10));
        });
        if (user && user.id)
            UserApi.updateProfile<UpdateProfileReq, UpdateProfileForm>(
                user.id,
                formData
            ).then(({ error, response }) => {
                isLoading(false);
                if (error instanceof UnprocessableEntityErrorResponse) {
                    const { violations } = error;
                    _forEach(violations, (value: string, key: string) => {
                        const propertyName = key as keyof UpdateProfileForm;
                        setError(propertyName, {
                            type: "backend",
                            message: value,
                        });
                    });
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
            <Row className="pt-3">
                <Col md={12} sm={12}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
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
                            </Form.Row>
                        </AppCard>
                    </Form>
                </Col>
            </Row>
        </>
    );
};
