import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form } from "react-bootstrap";
import { find as _find, isString as _isString } from "lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSetRecoilState } from "recoil";
import { AppButton } from "../../components/AppButton";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import {
    AppAuthFooter,
    AppAuthHeader,
} from "../../../SecurityModule/components";
import {
    AppFormFieldGenerator,
    AppFormInput,
    AppFormInputPassword,
    AppFormSelect,
    AppUploader,
    AppLoader,
    AppFormSwitch,
} from "../../components";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../utils";
import "./assets/scss/styles.scss";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    overViewLayout,
    normalLayout,
} from "../../atoms";
import { LanguageApi, UserApi, UserFieldApi } from "../../../AdminModule/apis";
import { Language, User, PUser, UserField } from "../../../AdminModule/models";
import {
    useAuthState,
    useBuildAssetPath,
    useNavigator,
    useSkipOnboarding,
} from "../../hooks";
import {
    FileTypeInfo,
    PrimitiveObject,
    SimpleObject,
    UnprocessableEntityErrorResponse,
    Upload,
} from "../../models";
import { UploadAPI } from "../../apis";
import { CONSTANTS } from "../../../config";

type UpdateProfileForm<T> = {
    [key: string]: T;
};

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
    FILETYPE: { FILETYPE_USER_PROFILE },
} = UPLOAD;
const schema = yup.object().shape({
    plainPassword: yup.string().min(6).required(),
    firstName: yup.string().required("First Name is Reqired"),
    lastName: yup.string().required("Last Name is Reqired"),
    company: yup.string().required(),
    jobTitle: yup.string().required(),
    locale: yup.string().required("Locale is Reqired"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("plainPassword"), null], "Passwords must be match"),
});

export const OnBoardingPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const [userFields, setUserFields] = useState<UserField[]>([]);
    const [languages, setLanguages] = useState<SimpleObject<string>[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const navigator = useNavigator(navigate);
    const { state, dispatch } = React.useContext(AuthContext);
    const { setSkipOnboarding } = useSkipOnboarding();
    const [dataLoading, isDataLoading] = React.useState<boolean>(true);
    const { clientId, containerId, user, containerResourceId } = useAuthState();
    const [data, setData] = useState<PUser>(new User(containerResourceId));
    const profilePicturePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo
    );
    const {
        control,
        handleSubmit,
        formState,
        setValue,
        setError,
    } = useForm<User>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );
    useEffect(() => {
        isDataLoading(true);
        UserApi.findById<User>(user?.id as number).then(
            ({ response, isNotFound, errorMessage }) => {
                isDataLoading(false);
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Language not exist");
                } else if (response !== null) {
                    setData(response);
                }
            }
        );
    }, []);
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
                if (data?.userFieldValues && data.userFieldValues?.length > 0) {
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
        if (formData.userField)
            formData.userFieldValues = getDynamicFileds(formData.userField);
        delete formData.userField;

        formData.isOnboarded = true;

        return UserApi.replace<User, UpdateProfileForm<any>>(
            user?.id || 0,
            formData
        ).then(({ error, errorMessage, response }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                setViolations<User>(error, setError);
            } else if (errorMessage) {
                errorToast(errorMessage);
            } else {
                navigator("/").then(() => {
                    successToast("Updated");
                });
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

    useEffect(() => {
        setLayoutOptions((currVal) => {
            return {
                ...currVal,
                ...overViewLayout,
            };
        });
        return () => {
            setLayoutOptions((currVal) => {
                return {
                    ...currVal,
                    ...normalLayout,
                };
            });
        };
    });
    const { errors } = formState;

    const onSubmit = async (formData: User) => {
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
    const fetchUserFields = async () => {
        return UserFieldApi.find<UserField>(1, { "client.id": clientId }).then(
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
    }, []);

    useEffect(() => {
        LanguageApi.find<Language>(1, { "container.id": containerId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    const langs: SimpleObject<string>[] = [];
                    response.items.forEach((e) => {
                        langs.push({
                            id: `${e.id}`,
                            value: e.locale,
                            label: e.name,
                        });
                    });
                    setLanguages(langs);
                }
            }
        );
    }, []);

    const getUserField = (name: string) => {
        return userFields.find((e: any) => e.fieldKey === name);
    };
    const getUserValue = (id: number) => {
        let defaultValue: any = null;
        data?.userFieldValues?.forEach((item: any) => {
            if (id === item.userField.id) defaultValue = item;
        });
        return defaultValue;
    };

    const onFileSelect = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
    };

    const getLocale = () => {
        const item = languages.find((e) => e.value === user?.locale);

        if (item) return item;

        return "";
    };
    if (dataLoading) return <AppLoader />;

    return (
        <Container fluid className="active-account auth-container">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader title="" />
                    <div className="active-account-box onboarding">
                        <Col md={12} className="active-account-box--auth-form">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Row>
                                    <Form.Group
                                        as={Col}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <AppUploader
                                            withCropper={true}
                                            fileInfo={
                                                FILETYPEINFO_USER_PROFILE as FileTypeInfo
                                            }
                                            accept="image/*"
                                            imagePath={
                                                user && user.imageName
                                                    ? `${profilePicturePath}/${user.imageName}`
                                                    : ""
                                            }
                                            onFileSelect={onFileSelect}
                                            onDelete={() => {
                                                setValue("imageName", "");
                                                setData({
                                                    ...user,
                                                    imageName: "",
                                                });
                                            }}
                                        />
                                    </Form.Group>
                                    {userFields && getUserField("salutation") && (
                                        <AppFormFieldGenerator
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            properties={getUserField(
                                                "salutation"
                                            )}
                                            setValue={setValue}
                                            control={control}
                                            defaultValue={getUserValue(
                                                getUserField("salutation")
                                                    ?.id || 0
                                            )}
                                            validation={{
                                                ...validation(
                                                    UserFieldApi.toResourceUrl(
                                                        getUserField(
                                                            "salutation"
                                                        )?.id || 0
                                                    ),
                                                    formState,
                                                    false
                                                ),
                                            }}
                                        />
                                    )}
                                    <AppFormInput
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"firstName"}
                                        label={"First Name"}
                                        required={true}
                                        {...validation(
                                            "firstName",
                                            formState,
                                            false
                                        )}
                                        defaultValue={user?.firstName}
                                        errorMessage={errors.firstName?.message}
                                        control={control}
                                    />
                                    <AppFormInput
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"lastName"}
                                        label={"Last Name"}
                                        defaultValue={user?.lastName}
                                        required={true}
                                        {...validation(
                                            "lastName",
                                            formState,
                                            false
                                        )}
                                        errorMessage={errors.lastName?.message}
                                        control={control}
                                    />
                                    <AppFormInput
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"company"}
                                        label={"Company"}
                                        defaultValue={user?.company}
                                        required={true}
                                        {...validation(
                                            "company",
                                            formState,
                                            false
                                        )}
                                        errorMessage={errors.company?.message}
                                        control={control}
                                    />
                                    <AppFormInput
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        defaultValue={user?.jobTitle}
                                        name={"jobTitle"}
                                        label={"Job Title"}
                                        {...validation(
                                            "jobTitle",
                                            formState,
                                            false
                                        )}
                                        errorMessage={errors.jobTitle?.message}
                                        control={control}
                                    />
                                    {userFields &&
                                        getUserField("industrySector") && (
                                            <AppFormFieldGenerator
                                                md={12}
                                                lg={12}
                                                xl={12}
                                                defaultValue={getUserValue(
                                                    getUserField(
                                                        "industrySector"
                                                    )?.id || 0
                                                )}
                                                properties={getUserField(
                                                    "industrySector"
                                                )}
                                                setValue={setValue}
                                                control={control}
                                                validation={{
                                                    ...validation(
                                                        UserFieldApi.toResourceUrl(
                                                            getUserField(
                                                                "industrySector"
                                                            )?.id || 0
                                                        ),
                                                        formState,
                                                        false
                                                    ),
                                                }}
                                            />
                                        )}
                                    <AppFormInput
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        defaultValue={user?.email}
                                        name={"email"}
                                        label={"Email"}
                                        {...validation(
                                            "email",
                                            formState,
                                            false
                                        )}
                                        errorMessage={errors.email?.message}
                                        control={control}
                                    />
                                    <AppFormInputPassword
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"plainPassword"}
                                        className="mb-0"
                                        label={"Password"}
                                        required={true}
                                        {...validation(
                                            "plainPassword",
                                            formState,
                                            false
                                        )}
                                        errorMessage={
                                            errors.plainPassword?.message
                                        }
                                        control={control}
                                    />
                                    <AppFormInputPassword
                                        lg={12}
                                        xl={12}
                                        name={"confirmPassword"}
                                        className="mb-0"
                                        label={"Confirm Password"}
                                        required={true}
                                        {...validation(
                                            "confirmPassword",
                                            formState,
                                            false
                                        )}
                                        errorMessage={
                                            errors.confirmPassword?.message
                                        }
                                        control={control}
                                    />
                                    {userFields && getUserField("postCode") && (
                                        <AppFormFieldGenerator
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            properties={getUserField(
                                                "postCode"
                                            )}
                                            defaultValue={getUserValue(
                                                getUserField("postCode")?.id ||
                                                    0
                                            )}
                                            setValue={setValue}
                                            control={control}
                                            validation={{
                                                ...validation(
                                                    UserFieldApi.toResourceUrl(
                                                        getUserField("postCode")
                                                            ?.id || 0
                                                    ),
                                                    formState,
                                                    false
                                                ),
                                            }}
                                        />
                                    )}
                                    {userFields && getUserField("city") && (
                                        <AppFormFieldGenerator
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            defaultValue={getUserValue(
                                                getUserField("city")?.id || 0
                                            )}
                                            properties={getUserField("city")}
                                            setValue={setValue}
                                            control={control}
                                            validation={{
                                                ...validation(
                                                    UserFieldApi.toResourceUrl(
                                                        getUserField("city")
                                                            ?.id || 0
                                                    ),
                                                    formState,
                                                    false
                                                ),
                                            }}
                                        />
                                    )}

                                    {userFields && getUserField("country") && (
                                        <AppFormFieldGenerator
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            defaultValue={getUserValue(
                                                getUserField("country")?.id || 0
                                            )}
                                            properties={getUserField("country")}
                                            setValue={setValue}
                                            control={control}
                                            validation={{
                                                ...validation(
                                                    UserFieldApi.toResourceUrl(
                                                        getUserField("country")
                                                            ?.id || 0
                                                    ),
                                                    formState,
                                                    false
                                                ),
                                            }}
                                        />
                                    )}
                                    {getUserField("mobile") && (
                                        <AppFormFieldGenerator
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            properties={getUserField("mobile")}
                                            setValue={setValue}
                                            control={control}
                                            defaultValue={getUserValue(
                                                getUserField("mobile")?.id || 0
                                            )}
                                            validation={{
                                                ...validation(
                                                    UserFieldApi.toResourceUrl(
                                                        getUserField("mobile")
                                                            ?.id || 0
                                                    ),
                                                    formState,
                                                    false
                                                ),
                                            }}
                                        />
                                    )}
                                    {getUserField(
                                        "creditSuisseContactFirstname"
                                    ) && (
                                        <AppFormFieldGenerator
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            defaultValue={getUserValue(
                                                getUserField(
                                                    "creditSuisseContactFirstname"
                                                )?.id || 0
                                            )}
                                            properties={getUserField(
                                                "creditSuisseContactFirstname"
                                            )}
                                            setValue={setValue}
                                            control={control}
                                            validation={{
                                                ...validation(
                                                    UserFieldApi.toResourceUrl(
                                                        getUserField(
                                                            "creditSuisseContactFirstname"
                                                        )?.id || 0
                                                    ),
                                                    formState,
                                                    false
                                                ),
                                            }}
                                        />
                                    )}
                                    {getUserField(
                                        "creditSuisseContactLastname"
                                    ) && (
                                        <AppFormFieldGenerator
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            properties={getUserField(
                                                "creditSuisseContactLastname"
                                            )}
                                            setValue={setValue}
                                            defaultValue={getUserValue(
                                                getUserField(
                                                    "creditSuisseContactLastname"
                                                )?.id || 0
                                            )}
                                            control={control}
                                            validation={{
                                                ...validation(
                                                    UserFieldApi.toResourceUrl(
                                                        getUserField(
                                                            "creditSuisseContactLastname"
                                                        )?.id || 0
                                                    ),
                                                    formState,
                                                    false
                                                ),
                                            }}
                                        />
                                    )}
                                    <AppFormSelect
                                        id={"locale"}
                                        defaultValue={getLocale()}
                                        name={"locale"}
                                        label={"Language"}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        required={true}
                                        {...validation(
                                            "locale",
                                            formState,
                                            false
                                        )}
                                        placeholder={"Locale"}
                                        errorMessage={errors.locale?.message}
                                        options={languages}
                                        control={control}
                                        transform={{
                                            output: (locale: PrimitiveObject) =>
                                                locale?.value,
                                            input: (value: string) => {
                                                return _find([], {
                                                    value,
                                                });
                                            },
                                        }}
                                    />
                                </Form.Row>
                                <Form.Row className="mb-3">
                                    <AppFormSwitch
                                        id={"isDisplayAsGuest"}
                                        name={"isDisplayAsGuest"}
                                        label={"Is Display as Guest?"}
                                        md={12}
                                        lg={4}
                                        xl={4}
                                        required={false}
                                        {...validation(
                                            "isDisplayAsGuest",
                                            formState,
                                            true
                                        )}
                                        defaultChecked={user?.isDisplayAsGuest}
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
                                        required={false}
                                        {...validation(
                                            "isExposeEmail",
                                            formState,
                                            true
                                        )}
                                        defaultChecked={user?.isExposeEmail}
                                        errorMessage={
                                            errors.isExposeEmail?.message
                                        }
                                        control={control}
                                    />
                                    <AppFormSwitch
                                        id={"isAllowCommunication"}
                                        name={"isAllowCommunication"}
                                        label={"Is Allow Communication?"}
                                        md={12}
                                        lg={4}
                                        xl={4}
                                        required={false}
                                        {...validation(
                                            "isAllowCommunication",
                                            formState,
                                            true
                                        )}
                                        defaultChecked={
                                            user?.isAllowCommunication
                                        }
                                        errorMessage={
                                            errors.isAllowCommunication?.message
                                        }
                                        control={control}
                                    />
                                </Form.Row>
                                <AppButton
                                    block={true}
                                    type={"submit"}
                                    loadingTxt={"Submit ..."}
                                    disabled={formState.isSubmitting}
                                    isLoading={formState.isSubmitting}
                                >
                                    Submit
                                </AppButton>

                                <AppButton
                                    onClick={() => {
                                        setSkipOnboarding(true);
                                        navigator("/").then();
                                    }}
                                    variant="link"
                                    className="btn-block mt-3"
                                >
                                    Skip and Continue Anonimously
                                </AppButton>
                            </Form>
                        </Col>
                    </div>
                </Row>
            </div>
            <AppAuthFooter />
        </Container>
    );
};
