import { Canceler } from "axios";
import React, { FC, useRef, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";
import {
    AppGridPagination,
    AppFormDropdown,
    AppLoader,
    AppExhibitorProductCard,
    AppButton,
} from "../../../AppModule/components";
import {
    defaultPageSize,
    pageSizeOptions,
} from "../../../AppModule/containers/AppGrid";
import { useAuthState, useIsGranted } from "../../../AppModule/hooks";
import { ExhibitorProductApi } from "../../apis";
import { Exhibitor, ExhibitorProduct } from "../../models";
import { ROLES } from "../../../config";

interface ExhibitorDetailTabProductType {
    exhibitor: Exhibitor;
}

export const ExhibitorDetailTabProducts: FC<ExhibitorDetailTabProductType> = ({
    exhibitor,
}) => {
    const { containerId } = useAuthState();
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [pageSize, setPageSize] = useState<number>(30);
    const [page, setPage] = useState<number>(1);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [data, setData] = useState<ExhibitorProduct[]>([]);
    const { id } = exhibitor;
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);
    const { t } = useTranslation();

    const fetchData = (params = {}) => {
        isLoading(true);
        ExhibitorProductApi.find<ExhibitorProduct>(
            page,
            {
                "exhibitor.id": id,
                "container.id": containerId,
                ...params,
            },
            (c) => {
                cancelTokenSourcesRef.current.push(c);
            }
        )
            .then(({ response }) => {
                if (response !== null) {
                    setData(response.items);
                    setTotalItems(response.totalItems);
                }
            })
            .finally(() => {
                isLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [pageSize]);

    return (
        <>
            <Row>
                <Col className="d-flex justify-content-end">
                    <AppButton
                        className={"text-capitalize"}
                        variant={"secondary"}
                        onClick={() => {
                            navigate(`/admin/exhibitors/${id}/products/new`);
                        }}
                    >
                        + {t("common.button:create")}
                    </AppButton>
                </Col>
            </Row>
            <Row>
                {loading ? (
                    <AppLoader />
                ) : (
                    data.map((e) => (
                        <AppExhibitorProductCard
                            data={e}
                            isGrantedControl={isGrantedControl}
                            handleDelete={() => {}}
                            handleClone={() => {}}
                            parentId={id}
                        />
                    ))
                )}
            </Row>
            {totalItems > 0 ? (
                <div className="d-flex flex-row app-grid-action py-2">
                    <AppGridPagination
                        className="mr-3"
                        itemsPerPage={pageSize}
                        totalItems={totalItems}
                        active={page}
                        onClick={(p) => {
                            setPage(p);
                            fetchData();
                        }}
                    />
                    <div className="pagination-container">
                        <AppFormDropdown
                            id={"pageSize"}
                            defaultValue={defaultPageSize()}
                            options={pageSizeOptions()}
                            onChange={(e: any) => setPageSize(e.value)}
                            menuPlacement={"top"}
                        />
                    </div>
                </div>
            ) : null}
        </>
    );
};
