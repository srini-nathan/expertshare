import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDataAddEdit } from "../../../AppModule/hooks";
import {
    AppBreadcrumb,
    AppCard,
    AppFormRadioGroup,
    AppLoader,
    AppPageHeader,
} from "../../../AppModule/components";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import { getTypeOptions, getChartOptions } from "./live-voting-helper";

export const LiveVotingAddEditPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { isLoading, isEditMode } = useDataAddEdit();
    const { control, setValue } = useForm({ mode: "all" });

    if (isLoading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("admin.liveVotes.list:header.backToSession")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.liveVotes.form:header.addTitle")
                        : t("admin.liveVotes.form:header.editTitle")
                }
            />
            <Row>
                <Col>
                    <AppCard>
                        <AppLanguageSwitcher />
                        <Row>
                            <AppFormRadioGroup
                                name={"type"}
                                control={control}
                                setValue={setValue}
                                options={getTypeOptions(t)}
                            />
                        </Row>
                        <Row>
                            <AppFormRadioGroup
                                name={"chartType"}
                                control={control}
                                setValue={setValue}
                                options={getChartOptions(t)}
                            />
                        </Row>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
