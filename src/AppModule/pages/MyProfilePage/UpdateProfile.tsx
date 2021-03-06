import React, { FC, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { find as _find, isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppCard,
    AppFormInput,
    AppButton,
    AppLoader,
    AppFormSelectCreatable,
    AppFormSelect,
    AppFormFieldGenerator,
    AppUploader,
    AppModal,
} from "../../components";
import {
    AuthContext,
    logoutAction,
} from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import {
    validation,
    errorToast,
    successToast,
    setViolations,
} from "../../utils";
import { useAuthState, useBuildAssetPath, useUserLocale } from "../../hooks";
import { UserApi, UserTagApi, UserFieldApi } from "../../../AdminModule/apis";
import {
    UserTag,
    UserField,
    User as UserModel,
    PUser,
} from "../../../AdminModule/models";
import {
    UnprocessableEntityErrorResponse,
    PrimitiveObject,
    SimpleObject,
    Upload,
    FileTypeInfo,
} from "../../models";
import { UploadAPI } from "../../apis";
import { CONSTANTS } from "../../../config";
import { useGlobalData } from "../../contexts";
import "./assets/scss/style.scss";

const { Upload: UPLOAD, User: USER } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_USER_PROFILE },
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;
const { TIMEZONE } = USER;

const options = TIMEZONE.map((value: string) => ({
    value,
    label: value,
}));

type UpdateProfileReq = {
    [key: string]: any;
};

type UpdateProfileForm<T> = {
    [key: string]: T;
};

export const UpdateProfile: FC<RouteComponentProps> = (): JSX.Element => {
    const { state, dispatch } = React.useContext(AuthContext);
    const { clientId, user } = state as AuthState;
    const [loading, isLoading] = React.useState<boolean>(false);
    const [dataLoading, isDataLoading] = React.useState<boolean>(true);
    const [fieldLoading, isFieldLoading] = React.useState<boolean>(true);
    const [showDelete, setShowDelete] = React.useState<boolean>(false);
    const [tagsLoading, setTagsLoading] = React.useState<boolean>(true);
    const [userTags, setUserTags] = useState<SimpleObject<string>[]>([]);
    const [selectedUserTags, setSelectedUserTag] = useState<
        SimpleObject<string>[]
    >([]);
    const { containerResourceId } = useAuthState();
    const { setLocale } = useUserLocale();
    const { container, activeLanguages } = useGlobalData();
    const [languages] = useState<SimpleObject<string>[]>(
        activeLanguages
            ? activeLanguages.map((l) => {
                  return {
                      value: l.locale,
                      label: l.name,
                  };
              })
            : []
    );
    const [data, setData] = useState<PUser>(new UserModel(containerResourceId));
    const [userFields, setUserFields] = useState<UserField[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const profilePicturePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo
    );
    const { t } = useTranslation();
    let validationShape = {
        firstName: Yup.string().min(2).required(),
        lastName: Yup.string().min(2).required(),
        company: Yup.string().min(2).required(),
        timezone: Yup.string().min(2).required(),
        locale: Yup.string().min(2).required(),
    };
    userFields.forEach((e) => {
        if (e.isActive && e.isRequired)
            validationShape = {
                ...validationShape,
                [UserFieldApi.toResourceUrl(e.id)]: Yup.string().required(
                    `${t(e.labelKey)} is a required field`
                ),
            };
    });
    const validationSchema = Yup.object().shape(validationShape);

    const { control, handleSubmit, formState, setError, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const { errors } = formState;
    const onFileSelect = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
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
                setTagsLoading(false);
            }
        );
    };

    useEffect(() => {
        isDataLoading(true);
        UserApi.findById<UserModel>(user?.id as number).then(
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
                            value: `${e.name}`,
                            id: `${e.id}`,
                            label: `${e.name}`,
                        });
                    });
                    setSelectedUserTag(selectedTags);
                }
                isDataLoading(false);
            }
        );
    }, []);

    useEffect(() => {
        fetchUserTags();
        const selectedTags: SimpleObject<string>[] = [];
        if (user && userTags)
            user?.userTags?.forEach((e: any) => {
                selectedTags.push({
                    id: `${e.id}`,
                    value: `${e.name}`,
                    label: `${e.name}`,
                });
            });
        setSelectedUserTag(selectedTags);
    }, []);

    const fetchUserFields = () => {
        isFieldLoading(true);
        UserFieldApi.find<UserField>(1, { "client.id": clientId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setUserFields(response.items);
                }
                isFieldLoading(false);
            }
        );
    };
    useEffect(() => {
        fetchUserFields();
    }, []);
    const getValue = (name: string) => {
        let val = "";
        if (
            container &&
            container.configuration &&
            (container?.configuration as any).translations
        )
            (container?.configuration as any).translations.forEach((e: any) => {
                if (e.locale === user?.locale) val = e[name];
            });
        return val;
    };
    const renderUserFields = () => {
        return userFields.map((e) => {
            const defaultValue: any = (data?.userFieldValues as any[]).find(
                (item: any) => e.id === item.userField.id
            );
            return (
                <AppFormFieldGenerator
                    key={e.id}
                    defaultValue={defaultValue}
                    properties={e}
                    setValue={setValue}
                    validation={{
                        ...validation(
                            UserFieldApi.toResourceUrl(e.id),
                            formState,
                            true
                        ),
                    }}
                    errorMessage={
                        errors[UserFieldApi.toResourceUrl(e.id)]?.message
                    }
                    control={control}
                />
            );
        });
    };
    const getDynamicFileds = (userField: any[]) => {
        const userFieldValues: any[] = [];

        if (userField)
            Object.keys(userField).forEach((key: any) => {
                let value: any = userField[key];

                if (value instanceof Date)
                    value = value.toISOString().slice(0, 10);
                else if (value instanceof Object)
                    value = JSON.stringify(
                        Object.keys(value).filter((item) => value[item])
                    );
                else if (value === undefined) value = "false";

                if (data.userFieldValues && data.userFieldValues?.length > 0) {
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
    const submitForm = async (formData: UpdateProfileForm<any>) => {
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
                    // @TODO: translation missing
                    successToast("Profile has been updated successfully.");
                    if (response) {
                        setLocale(response.locale);
                    }
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
    const onSubmit = async (formData: UserModel) => {
        if (files.length > 0) {
            const fd = new FormData();
            fd.set("file", files[0], files[0].name);
            fd.set("fileType", FILETYPE_USER_PROFILE);

            return UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ errorMessage, response }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                        return submitForm(formData);
                    }

                    if (response && response.fileName) {
                        formData.imageName = response.fileName;
                    }

                    successToast("Image uploaded");
                    return submitForm(formData);
                }
            );
        }
        return submitForm(formData);
    };

    const handleDelete = () => {
        if (user && user.id) {
            UserApi.deleteById(user.id)
                .then(({ error, errorMessage }) => {
                    setShowDelete(false);
                    if (!error) {
                        successToast(t("profile.update:deleteProfile.success"));
                        logoutAction(dispatch).finally();
                    } else {
                        errorToast(t(errorMessage));
                    }
                })
                .catch(() => {
                    setShowDelete(false);
                });
        }
    };

    if (dataLoading || fieldLoading || tagsLoading) return <AppLoader />;

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="pt-3 update-profile">
                    <Col md={12} sm={12}>
                        <AppCard>
                            <Row className="m-0">
                                <Col className="p-0">
                                    <AppFormInput
                                        lg={12}
                                        xl={12}
                                        name={"firstName"}
                                        label={t(
                                            "profile.update:label.firstName"
                                        )}
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
                                        lg={12}
                                        xl={12}
                                        name={"lastName"}
                                        defaultValue={user?.lastName}
                                        label={t(
                                            "profile.update:label.lastName"
                                        )}
                                        required={true}
                                        {...validation(
                                            "lastName",
                                            formState,
                                            true
                                        )}
                                        errorMessage={errors.lastName?.message}
                                        control={control}
                                    />

                                    <AppFormInput
                                        lg={12}
                                        xl={12}
                                        name={"company"}
                                        defaultValue={user?.company}
                                        label={t(
                                            "profile.update:label.companyName"
                                        )}
                                        required={true}
                                        {...validation(
                                            "company",
                                            formState,
                                            true
                                        )}
                                        errorMessage={errors.Company?.message}
                                        control={control}
                                    />
                                    <AppFormInput
                                        lg={12}
                                        xl={12}
                                        defaultValue={user?.jobTitle}
                                        name={"jobTitle"}
                                        label={t(
                                            "profile.update:label.jobTitile"
                                        )}
                                        required={true}
                                        {...validation(
                                            "jobTitle",
                                            formState,
                                            true
                                        )}
                                        errorMessage={errors.jobTitle?.message}
                                        control={control}
                                    />

                                    <AppFormSelect
                                        id={"locale"}
                                        name={"locale"}
                                        label={t("profile.update:label.locale")}
                                        className="local-container "
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        required={true}
                                        {...validation(
                                            "locale",
                                            formState,
                                            true
                                        )}
                                        defaultValue={data?.locale}
                                        placeholder={"Locale"}
                                        errorMessage={errors.locale?.message}
                                        options={languages}
                                        control={control}
                                        transform={{
                                            output: (l: PrimitiveObject) =>
                                                l?.value,
                                            input: (value: string) => {
                                                const active = _find(
                                                    languages,
                                                    {
                                                        value,
                                                    }
                                                );
                                                return active;
                                            },
                                        }}
                                    />
                                    <AppFormSelect
                                        id={"timezone"}
                                        name={"timezone"}
                                        label={t(
                                            "profile.update:label.timezone"
                                        )}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        className="rm-container"
                                        required={true}
                                        {...validation(
                                            "timezone",
                                            formState,
                                            true
                                        )}
                                        defaultValue={{
                                            value: user?.timezone
                                                ? user?.timezone
                                                : "",
                                            label: user?.timezone
                                                ? user?.timezone
                                                : "",
                                        }}
                                        placeholder={"Timezone"}
                                        errorMessage={errors.timezone?.message}
                                        options={options}
                                        control={control}
                                        transform={{
                                            output: (
                                                template: PrimitiveObject
                                            ) => template?.value,
                                            input: (value: string) => {
                                                return _find([], {
                                                    value,
                                                });
                                            },
                                        }}
                                    />
                                    <AppFormSelectCreatable
                                        name="userTags"
                                        label={t(
                                            "profile.update:label.userTags"
                                        )}
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
                                </Col>

                                <Form.Group className="px-3 col-sm-12 col-lg-6 user-profile-uploader">
                                    <Form.Label>
                                        {t("profile.update:label.image")}
                                    </Form.Label>
                                    <AppUploader
                                        withCropper={true}
                                        fileInfo={
                                            FILETYPEINFO_USER_PROFILE as FileTypeInfo
                                        }
                                        accept="image/*"
                                        imagePath={
                                            data.imageName
                                                ? `${profilePicturePath}/${data.imageName}`
                                                : ""
                                        }
                                        onFileSelect={onFileSelect}
                                        onDelete={() => {
                                            setValue("imageName", "");
                                            setData({
                                                ...data,
                                                imageName: "",
                                            });
                                        }}
                                        confirmation={{
                                            title:
                                                "profile.update:image.deleteconfirm.title",
                                            bodyContent:
                                                "profile.update:image.deleteconfirm.content",
                                        }}
                                    />
                                </Form.Group>
                            </Row>
                        </AppCard>
                    </Col>
                    <Col md={12}>
                        <AppCard>
                            <Row className="m-0">
                                {renderUserFields()}

                                {container &&
                                    container.configuration &&
                                    (container.configuration as any)
                                        .isDisclaimerEnable &&
                                    getValue("disclaimerTextProfile") !==
                                        "" && (
                                        <Form.Group className="p-3 w-100">
                                            <div className="agreement-box mt-2 p-2">
                                                <div className="agreement-box--inner">
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: getValue(
                                                                "disclaimerTextProfile"
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Form.Group>
                                    )}
                            </Row>
                            <Row className="m-0">
                                <Col className={"d-flex justify-content-end"}>
                                    <AppModal
                                        show={showDelete}
                                        title={t(
                                            "profile.update:deleteProfile.confirmTitle"
                                        )}
                                        handleClose={() => {
                                            setShowDelete(false);
                                        }}
                                        handleDelete={() => {
                                            handleDelete();
                                        }}
                                        bodyContent={t(
                                            "profile.update:deleteProfile.confirmContent"
                                        )}
                                    />
                                </Col>
                            </Row>
                        </AppCard>
                    </Col>
                    <Col md={12} className="justify-content-end d-flex">
                        {loading ? (
                            <AppLoader containerClassName="custom-btn-loader" />
                        ) : (
                            <div>
                                <AppButton
                                    variant={"danger"}
                                    onClick={() => {
                                        setShowDelete(true);
                                    }}
                                    className={"mr-3"}
                                >
                                    {t("profile.update:deleteProfile.label")}
                                </AppButton>
                                <AppButton variant="primary" type="submit">
                                    {t("common.button:save")}
                                </AppButton>
                            </div>
                        )}
                    </Col>
                </Row>
            </Form>
        </>
    );
};
