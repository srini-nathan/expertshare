import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import {
    AppGridAction,
    AppGridActionProps,
    AppRadio,
} from "../../../AppModule/components";
import { AFrameRoom } from "../../models";
import { AFrameRoomApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";
import { AppCellActionParams } from "../../../AppModule/models";

export interface AppCellActionWithRenderParams
    extends AppCellActionParams,
        ICellRendererParams {}

export const appGridFrameworkComponents = {
    AppFormRadio: (params: ICellRendererParams): ReactElement => {
        const { data, api } = params;
        const { id, isEntryRoom = false } = data as AFrameRoom;
        const { t } = useTranslation();

        return (
            <AppRadio
                name={`isEntryRoom-${id}`}
                id={`isEntryRoom-${id}`}
                defaultChecked={isEntryRoom}
                onChange={() => {
                    AFrameRoomApi.setDefaultRoom<AFrameRoom>(id).then(
                        ({ errorMessage, error }) => {
                            if (error) {
                                errorToast(errorMessage);
                            } else {
                                api.refreshServerSideStore({ purge: true });
                                successToast(
                                    t(
                                        "admin.language.list:defaultlanguage.toast.success"
                                    )
                                );
                            }
                        }
                    );
                }}
            ></AppRadio>
        );
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete, isGrantedControl } = params;
        const { id } = data;

        const props: AppGridActionProps = {
            isGrantedControl,
            editAction: {
                url: `/admin/room/${id}`,
            },
            viewAction: {
                url: `/admin/room/${id}`,
            },
            deleteAction: {
                confirmation: "Are you sure want to delete?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
            customClickActions: [],
        };

        return <AppGridAction {...props} />;
    },
};
