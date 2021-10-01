import React, { FC, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "@reach/router";
import { Form, Row } from "react-bootstrap";
import { AppBreadcrumb, AppFormActions, AppPageHeader } from "../../components";
import { MeetingAddEditTabs } from "./MeetingAddEditTabs";
import { MeetingAddEditTab1 } from "./MeetingAddEditTab1";
import { MeetingAddEditTab2 } from "./MeetingAddEditTab2";
import { MeetingAddEditTab3 } from "./MeetingAddEditTab3";
import { useAuthState, useDataAddEdit, useNavigator } from "../../hooks";
import { Meeting } from "../../models/entities/Meeting";
import { schema } from "./schema";
import "./assets/scss/style.scss";

export const MeetingAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const { clientResourceId, userResourceId } = useAuthState();
    const [active, setActive] = useState<number>(1);
    const { hookForm, isEditMode, data } = useDataAddEdit<Meeting>(
        new Meeting(clientResourceId, userResourceId),
        schema()
    );
    const { formState, handleSubmit } = hookForm;
    const navigator = useNavigator(navigate);

    const onSubmit = async () => {};

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("meeting.list:header.title")}
                linkUrl={"/meetings"}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("meeting.form:header.title.edit")
                        : t("meeting.form:header.title.add")
                }
            ></AppPageHeader>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="schedule-meeting--container mb-3">
                    <div className="inner-content card">
                        <MeetingAddEditTabs
                            defaultActiveTab={1}
                            onChangeTab={(tab) => {
                                setActive(tab);
                            }}
                        />
                        <div
                            className="inner-content--steps tab-content"
                            id="myTabContent"
                        >
                            <MeetingAddEditTab1
                                active={active}
                                form={hookForm}
                                data={data}
                                isEditMode={isEditMode}
                            />
                            <MeetingAddEditTab2
                                active={active}
                                form={hookForm}
                                data={data}
                                isEditMode={isEditMode}
                            />
                            <MeetingAddEditTab3
                                active={active}
                                form={hookForm}
                                data={data}
                                isEditMode={isEditMode}
                            />
                        </div>
                    </div>
                </div>
                <Row>
                    <AppFormActions
                        isEditMode={isEditMode}
                        navigation={navigator}
                        backLink={".."}
                        isLoading={formState.isSubmitting}
                    />
                </Row>
            </Form>
        </Fragment>
    );
};
