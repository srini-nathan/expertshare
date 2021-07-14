import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
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
    useUserLocale,
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

const {
    Role: { ROLE },
} = CONSTANTS;

type UpdateProfileForm<T> = {
    [key: string]: T;
};

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
    FILETYPE: { FILETYPE_USER_PROFILE },
} = UPLOAD;

export const OnBoardingPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const [, setUserFields] = useState<UserField[]>([]);
    const [languages, setLanguages] = useState<SimpleObject<string>[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const navigator = useNavigator(navigate);
    const { state, dispatch } = React.useContext(AuthContext);
    const { setSkipOnboarding } = useSkipOnboarding();
    const [dataLoading, isDataLoading] = React.useState<boolean>(true);
    const { clientId, containerId, user, containerResourceId } = useAuthState();
    const [, setData] = useState<PUser>(new User(containerResourceId));
    const profilePicturePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo
    );
    const { t } = useTranslation();
    const { setLocale } = useUserLocale();
    const { role } = useAuthState();

    const validationShape = {
        plainPassword: yup.string().min(6).required(),
        firstName: yup.string().required("First Name is Reqired"),
        lastName: yup.string().required("Last Name is Reqired"),
        locale: yup.string().required("Locale is Reqired"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("plainPassword"), null], "Passwords must be match"),
    };

    const validationSchema = yup.object().shape(validationShape);

    const {
        control,
        handleSubmit,
        formState,
        setValue,
        setError,
    } = useForm<User>({
        resolver: yupResolver(validationSchema),
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

    const submitForm = async (formData: UpdateProfileForm<any>) => {
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
                setLocale(formData.locale);
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
                                    <Form.Group className="col-12">
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

                                    <AppFormInput
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"firstName"}
                                        label={t(
                                            "profile.update:label.firstName"
                                        )}
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
                                        label={t(
                                            "profile.update:label.lastName"
                                        )}
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
                                        label={t(
                                            "profile.update:label.company"
                                        )}
                                        defaultValue={user?.company}
                                        required={false}
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
                                        required={false}
                                        name={"jobTitle"}
                                        label={t(
                                            "profile.update:label.jobTitle"
                                        )}
                                        {...validation(
                                            "jobTitle",
                                            formState,
                                            false
                                        )}
                                        errorMessage={errors.jobTitle?.message}
                                        control={control}
                                    />

                                    {/* <AppFormInput
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        defaultValue={user?.email}
                                        name={"email"}
                                        label={t("profile.update:label.email")}
                                        {...validation(
                                            "email",
                                            formState,
                                            false
                                        )}
                                        errorMessage={errors.email?.message}
                                        control={control}
                                    /> */}

                                    <AppFormSelect
                                        id={"locale"}
                                        defaultValue={getLocale()}
                                        name={"locale"}
                                        label={t("profile.update:label.locale")}
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
                                    <AppFormInputPassword
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"plainPassword"}
                                        className="mb-0"
                                        label={t(
                                            "profile.update:label.password"
                                        )}
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
                                        label={t(
                                            "profile.update:label.confirmPassword"
                                        )}
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
                                </Form.Row>
                                <Form.Row className="mb-3">
                                    <Col sm="12" className="mb-3  text-center">
                                        <span className="onboarding-sectoin">
                                            {t("onboarding.section:privacy")}
                                        </span>
                                    </Col>
                                    {role === ROLE.ROLE_SPEAKER ||
                                    role === ROLE.ROLE_MODERATOR ? null : (
                                        <AppFormSwitch
                                            id={"isDisplayAsGuest"}
                                            name={"isDisplayAsGuest"}
                                            label={t(
                                                "profile.update:label.isDisplayAsGuest"
                                            )}
                                            md={12}
                                            lg={4}
                                            xl={4}
                                            required={false}
                                            {...validation(
                                                "isDisplayAsGuest",
                                                formState,
                                                true
                                            )}
                                            defaultChecked={true}
                                            errorMessage={
                                                errors.isDisplayAsGuest?.message
                                            }
                                            control={control}
                                        />
                                    )}
                                    <AppFormSwitch
                                        id={"isExposeEmail"}
                                        name={"isExposeEmail"}
                                        label={t(
                                            "profile.update:label.isExposeEmail"
                                        )}
                                        md={12}
                                        lg={4}
                                        xl={4}
                                        required={false}
                                        {...validation(
                                            "isExposeEmail",
                                            formState,
                                            true
                                        )}
                                        defaultChecked={false}
                                        errorMessage={
                                            errors.isExposeEmail?.message
                                        }
                                        control={control}
                                    />
                                    <AppFormSwitch
                                        id={"isAllowCommunication"}
                                        name={"isAllowCommunication"}
                                        label={t(
                                            "profile.update:label.isAllowCommunication"
                                        )}
                                        md={12}
                                        lg={4}
                                        xl={4}
                                        required={false}
                                        {...validation(
                                            "isAllowCommunication",
                                            formState,
                                            true
                                        )}
                                        defaultChecked={true}
                                        errorMessage={
                                            errors.isAllowCommunication?.message
                                        }
                                        control={control}
                                    />
                                </Form.Row>
                                <AppButton
                                    block={true}
                                    type={"submit"}
                                    loadingTxt={t("common.button:submit")}
                                    disabled={formState.isSubmitting}
                                    isLoading={formState.isSubmitting}
                                >
                                    {t("common.button:submit")}
                                </AppButton>

                                <AppButton
                                    onClick={() => {
                                        setSkipOnboarding(true);
                                        navigator("/").then();
                                    }}
                                    variant="link"
                                    className="btn-block mt-3"
                                >
                                    {t("onboarding.label:skip")}
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
