import React, { FC, useState, useEffect, useRef } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppButton } from "../../../AppModule/components/AppButton";
import { AuthContext, loginAction } from "../../contexts/AuthContext";
import { useGlobalData } from "../../../AppModule/contexts";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import {
    AppFormInput,
    AppFormInputPassword,
} from "../../../AppModule/components";
import {
    errorToast,
    getBGStyle,
    parseDesign,
    setViolations,
    validation,
} from "../../../AppModule/utils";
import "./assets/scss/styles.scss";
import { UserApi } from "../../../AdminModule/apis";
import {
    FileTypeInfo,
    UnprocessableEntityErrorResponse,
} from "../../../AppModule/models";
import {
    API_HOST,
    AUTH_CHOSEN_CONTAINER,
    AUTH_TOKEN_KEY,
    AUTH_USER_KEY,
    AUTH_SKIP_ONBOARDING,
    CONTAINER_LOCALE,
    LANGUAGES,
} from "../../../AppModule/config/app-env";
import { useBuildAssetPath, useUserLocale } from "../../../AppModule/hooks";
import { CONSTANTS } from "../../../config";

const {
    Upload: {
        FILETYPEINFO: { FILETYPEINFO_DESIGN_CONFIGURATION },
    },
} = CONSTANTS;

type LoginForm = {
    email: string;
    password?: string;
};

const schema = yup.object().shape({
    email: yup.string().email().required(),
    // password: yup.string().min(6).required(),
});

export const LoginPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [emailStatus, setEmailStatus] = useState<string>("");
    const [agree, isAgree] = useState<boolean>(false);
    const [onboarded, isOnboarded] = useState<boolean>(false);
    const [activeLanguage, setActiveLanguage] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const {
        control,
        handleSubmit,
        formState,
        setFocus,
        setError,
    } = useForm<LoginForm>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const desclaimer = useRef<HTMLDivElement>(null);
    const { container, activeLanguages } = useGlobalData();
    const { errors } = formState;
    const { t } = useTranslation();
    const { setLocale } = useUserLocale();
    const design = parseDesign(container);
    const baseDesignConfig = useBuildAssetPath(
        FILETYPEINFO_DESIGN_CONFIGURATION as FileTypeInfo
    );
    const { genImageBackgroundLogin } = design;
    const bgStyle = getBGStyle(baseDesignConfig, genImageBackgroundLogin);

    useEffect(() => {
        setLocale(activeLanguage);
    }, [activeLanguage]);
    useEffect(() => {
        container?.languages?.forEach((e) => {
            if (e.isDefault) setActiveLanguage(e.locale);
        });

        localStorage.setItem(LANGUAGES, JSON.stringify(container?.languages));
    }, [container]);

    const getValue = (name: string) => {
        let val = "";
        if (
            container &&
            container.configuration &&
            (container?.configuration as any).translations
        )
            (container?.configuration as any).translations.forEach((e: any) => {
                if (e.locale === activeLanguage) val = e[name];
            });
        return val;
    };

    const onSubmitCheckUser = async ({ email }: LoginForm) => {
        setUserEmail(email);
        return UserApi.emailExist({
            email,
        }).then(({ error, errorMessage, response }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                setViolations<LoginForm>(error, setError);
            } else if (errorMessage) {
                errorToast(errorMessage);
            } else if (response) {
                if (response.isExist) {
                    if (
                        response.isActivationEmailEnable &&
                        !response.isOnboarded
                    ) {
                        setEmailStatus("activationsent");
                    } else {
                        setEmailStatus("exist");
                        setFocus("password");
                        localStorage.removeItem(AUTH_CHOSEN_CONTAINER);
                        localStorage.removeItem(AUTH_TOKEN_KEY);
                        localStorage.removeItem(AUTH_USER_KEY);
                        localStorage.removeItem(AUTH_SKIP_ONBOARDING);
                        localStorage.removeItem(CONTAINER_LOCALE);

                        if (response.isOnboarded) {
                            isOnboarded(true);
                        }
                    }
                } else {
                    setEmailStatus("notexist");
                }
            }
        });
    };
    const { dispatch } = React.useContext(AuthContext);
    const onSubmit = async ({ password }: LoginForm) => {
        await loginAction(userEmail, password as string, dispatch);
    };
    const renderView = () => {
        switch (emailStatus) {
            case "notexist":
                return (
                    <>
                        <AppAuthHeader
                            title={t("login.form:notRegisteredTitle")}
                            description={t(
                                "login.form:notRegisteredDescription"
                            )}
                        />
                        <Col className="text-center justify-content-center d-flex p-3">
                            <AppButton
                                variant="primary"
                                onClick={() => {
                                    setEmailStatus("");
                                }}
                            >
                                <b>{t("login.form:login")}</b>
                            </AppButton>
                        </Col>
                    </>
                );
            case "activationsent":
                return (
                    <>
                        <AppAuthHeader
                            title={t("login.form:activationTitle")}
                            description={t("login.form:activationDescription")}
                        />
                        <Col className="text-center justify-content-center d-flex p-3">
                            <AppButton
                                variant="primary"
                                onClick={() => {
                                    setEmailStatus("");
                                }}
                            >
                                <b>{t("login.form:goBack")}</b>
                            </AppButton>
                        </Col>
                    </>
                );
            default:
                return (
                    <>
                        <AppAuthHeader
                            title={t("login.form:title")}
                            description={t("login.form:description")}
                        />
                        <div className="active-account-box">
                            <Col
                                md={12}
                                className="active-account-box--auth-form"
                            >
                                <Form
                                    onSubmit={handleSubmit(
                                        emailStatus === "exist"
                                            ? onSubmit
                                            : onSubmitCheckUser
                                    )}
                                >
                                    <Form.Group>
                                        <Form.Row>
                                            <AppFormInput
                                                md={12}
                                                lg={12}
                                                xl={12}
                                                type={"email"}
                                                name={"email"}
                                                placeholder="Email"
                                                label={""}
                                                required={true}
                                                {...validation(
                                                    "email",
                                                    formState,
                                                    false
                                                )}
                                                errorMessage={
                                                    errors.email?.message
                                                }
                                                control={control}
                                            />
                                        </Form.Row>
                                        {emailStatus === "exist" && (
                                            <>
                                                <Form.Row>
                                                    <AppFormInputPassword
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                        className="m-0"
                                                        name={"password"}
                                                        label={""}
                                                        placeholder="Password"
                                                        required={true}
                                                        {...validation(
                                                            "password",
                                                            formState,
                                                            false
                                                        )}
                                                        errorMessage={
                                                            errors.password
                                                                ?.message
                                                        }
                                                        control={control}
                                                    />
                                                </Form.Row>

                                                <Link
                                                    to={"/auth/forgot-password"}
                                                    className="forgot-password "
                                                >
                                                    {t(
                                                        "login.form:forgotPassword"
                                                    )}
                                                </Link>
                                            </>
                                        )}

                                        {container &&
                                            container.configuration &&
                                            (container.configuration as any)
                                                .isDisclaimerEnable &&
                                            emailStatus === "exist" &&
                                            !onboarded && (
                                                <Form.Group>
                                                    <div className="agreement-box mt-2 p-2">
                                                        <div
                                                            ref={desclaimer}
                                                            className="agreement-box--inner"
                                                        >
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: getValue(
                                                                        "disclaimerText"
                                                                    ),
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Form.Check
                                                        onChange={() => {
                                                            isAgree(!agree);
                                                        }}
                                                        className="mt-2"
                                                        type="checkbox"
                                                        label={t(
                                                            "login.form:disclaimerAgree"
                                                        )}
                                                        id="checkbox-des"
                                                    />
                                                </Form.Group>
                                            )}
                                    </Form.Group>
                                    <AppButton
                                        block={true}
                                        type={"submit"}
                                        loadingTxt={`${t(
                                            "login.form:login"
                                        )} ...`}
                                        disabled={
                                            formState.isSubmitting ||
                                            (container &&
                                                container.configuration &&
                                                (container.configuration as any)
                                                    .isDisclaimerEnable &&
                                                !agree &&
                                                emailStatus === "exist" &&
                                                !onboarded)
                                        }
                                        isLoading={formState.isSubmitting}
                                    >
                                        {t("login.form:login")}
                                    </AppButton>
                                    <Row className={"mt-3"}>
                                        {container &&
                                            container.configuration &&
                                            ((container.configuration as any)
                                                .isLoginGoogleEnable ||
                                                (container.configuration as any)
                                                    .isLoginLinkedinEnable ||
                                                (container.configuration as any)
                                                    .isLoginAzureEnable) && (
                                                <Col
                                                    sm={12}
                                                    className={
                                                        "text-center my-4 normal-label"
                                                    }
                                                >
                                                    <span>
                                                        {t(
                                                            "login.form:orLoginWith"
                                                        )}
                                                    </span>
                                                </Col>
                                            )}
                                        {container &&
                                            container.configuration &&
                                            (container.configuration as any)
                                                .isLoginGoogleEnable && (
                                                <Col
                                                    md={4}
                                                    xl={4}
                                                    lg={4}
                                                    sm={12}
                                                >
                                                    <a
                                                        className={
                                                            "btn mb-3 btn-secondary justify-content-center social-media-button" +
                                                            " google"
                                                        }
                                                        href={`${API_HOST}/social/connect/google`}
                                                    >
                                                        Google
                                                    </a>
                                                </Col>
                                            )}
                                        {container &&
                                            container.configuration &&
                                            (container.configuration as any)
                                                .isLoginLinkedinEnable && (
                                                <Col
                                                    md={4}
                                                    xl={4}
                                                    lg={4}
                                                    sm={12}
                                                >
                                                    <a
                                                        className={
                                                            "btn mb-3 btn-secondary justify-content-center social-media-button linkedin"
                                                        }
                                                        href={`${API_HOST}/social/connect/linkedin`}
                                                    >
                                                        LinkedIn
                                                    </a>
                                                </Col>
                                            )}
                                        {container &&
                                            container.configuration &&
                                            (container.configuration as any)
                                                .isLoginAzureEnable && (
                                                <Col
                                                    md={4}
                                                    xl={4}
                                                    lg={4}
                                                    sm={12}
                                                >
                                                    <a
                                                        className={
                                                            "btn mb-3 btn-secondary justify-content-center social-media-button azure"
                                                        }
                                                        href={`${API_HOST}/social/connect/azure`}
                                                    >
                                                        Azure
                                                    </a>
                                                </Col>
                                            )}
                                    </Row>
                                </Form>
                            </Col>
                        </div>
                    </>
                );
        }
    };

    return (
        <Container
            fluid
            className="active-account auth-container with-bg"
            style={bgStyle}
        >
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <div className="tabs-translation-auth mb-3 justify-content-center">
                        <Row className="m-0 p-0 justify-content-center app-language-switcher">
                            {container &&
                                activeLanguages?.map((e, i) => {
                                    return (
                                        <div
                                            className={`${e.locale} ${
                                                activeLanguage === e.locale &&
                                                "active"
                                            } mx-1 my-1 mx-sm-1 col-auto col-sm-auto lang-item`}
                                            onClick={() => {
                                                setActiveLanguage(e.locale);
                                            }}
                                            key={i}
                                        >
                                            <i className="flag"></i>
                                            {e.name}
                                        </div>
                                    );
                                })}
                        </Row>
                    </div>
                    {renderView()}
                </Row>
            </div>
            <AppAuthFooter copyRight={getValue("copyrightContent")} />
        </Container>
    );
};
