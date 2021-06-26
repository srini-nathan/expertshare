import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import { Col, Form, Row } from "react-bootstrap";
import { Canceler } from "axios";
import { Client, Package } from "../../models";
import { ClientApi, PackageApi } from "../../apis";
import {
    AppFormTextArea,
    AppLoader,
    AppCard,
    AppBreadcrumb,
    AppPageHeader,
    AppFormActions,
} from "../../../AppModule/components";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { AppPackageSwitches } from "../../components";
import { useNavigator, useParamId } from "../../../AppModule/hooks";

type PartialClient = Partial<Client>;

const schema = Yup.object().shape({
    name: Yup.string().required(),
    notes: Yup.string().nullable(),
});

export const ClientAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { t } = useTranslation();

    const [data, setData] = React.useState<PartialClient>(new Client());
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [loadingPackages, setLoadingPackages] = useState<boolean>(true);
    const cancelTokenSourceRef = useRef<Canceler>();

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<PartialClient>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    useEffect(() => {
        setLoadingPackages(true);
        PackageApi.find<Package>(1, {}, (c) => {
            cancelTokenSourceRef.current = c;
        }).then(({ response, error }) => {
            setLoadingPackages(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setPackages(response.items);
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
            ClientApi.findById<Client>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Client not exist");
                    } else if (response !== null) {
                        const packs = response.packages as Package[];
                        setData({
                            ...response,
                            packages: packs.map(({ id: packId }) =>
                                PackageApi.toResourceUrl(packId)
                            ),
                        });
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    const onSubmit = async (formData: Client) => {
        return ClientApi.createOrUpdate<Client>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<PartialClient>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode ? "Client updated" : "Client created"
                        );
                    });
                }
            }
        );
    };

    if (loading || loadingPackages) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:clients")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.client.form:header.titleEdit")
                        : t("admin.client.form:header.title")
                }
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"name"}
                                    label={t("admin.client.form:label.name")}
                                    placeholder={t(
                                        "admin.client.form:label.name"
                                    )}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    defaultValue={data.name}
                                    control={control}
                                />
                                <AppFormTextArea
                                    lg={6}
                                    xl={6}
                                    name={"notes"}
                                    label={t("admin.client.form:label.notes")}
                                    placeholder={t(
                                        "admin.client.form:label.notes"
                                    )}
                                    {...validation(
                                        "notes",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.notes?.message}
                                    defaultValue={data.notes || ""}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
                        <AppCard title={t("admin.client.form:label.packages")}>
                            <Form.Row>
                                <AppPackageSwitches
                                    packages={packages}
                                    control={control}
                                    activePacks={data.packages as string[]}
                                    onChange={(activePacks) => {
                                        setData({
                                            ...data,
                                            packages: activePacks,
                                        });
                                    }}
                                />
                            </Form.Row>
                        </AppCard>
                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
