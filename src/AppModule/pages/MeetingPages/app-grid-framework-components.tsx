import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { ICellRendererParams } from "ag-grid-community";
import { AppGridAction, AppGridActionProps, AppRadio } from "../../components";
import { AppCellActionWithRenderWithCustom } from "./app-actions";
import { errorToast, successToast } from "../../utils";
import { Meeting, PMeeting } from "../../models/entities/Meeting";
import { MeetingApi } from "../../apis/MeetingApi";

export const appGridFrameworkComponents = {
    AppFormRadio: (params: ICellRendererParams): ReactElement => {
        const { data, api } = params;
        const { id, name, isActive } = data as Meeting;
        const { t } = useTranslation();

        return (
            <AppRadio
                name={"isActive"}
                defaultChecked={isActive}
                id={`is-active-${name}-${id}`}
                onChange={() => {
                    MeetingApi.update<Meeting, PMeeting>(id, {
                        isActive: true,
                    }).then(({ errorMessage, error }) => {
                        if (error) {
                            errorToast(errorMessage);
                        } else {
                            api.refreshServerSideStore({ purge: true });
                            successToast(
                                t(
                                    "meeting.myMeetings.list:activeMeeting.toast.success"
                                )
                            );
                        }
                    });
                }}
            />
        );
    },
    AppNameRender: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { data } = params;
        const { name, id } = data as Meeting;
        return (
            <>
                {name}
                <br />
                <span>/book-meeting/{id}</span>
            </>
        );
    },
    AppGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as Meeting;
        const { t } = useTranslation();

        const props: AppGridActionProps = {
            editAction: {
                url: `/meetings/${id}`,
            },
            deleteAction: {
                confirmation: t(
                    "meeting.myMeetings.list:delete.confirmation.message"
                ),
                confirmationTitle: t(
                    "meeting.myMeetings.list:delete.confirmation.title"
                ),
                onClick: () => {
                    onPressDelete(id);
                },
            },
        };

        return <AppGridAction {...props} />;
    },
};
