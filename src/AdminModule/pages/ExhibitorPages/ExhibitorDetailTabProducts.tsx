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
import { ExhibitorCategoryApi, ExhibitorProductApi } from "../../apis";
import { Exhibitor, ExhibitorCategory, ExhibitorProduct } from "../../models";
import { ROLES } from "../../../config";
import { DropDownOption } from "../../../AppModule/models";

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
    const [optionTags, setOptionTags] = useState<DropDownOption[]>([]);
    const [, setSelectedTag] = useState<number>(0);
    const [loadingTags, setLoadingTags] = useState<boolean>(true);

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

    useEffect(() => {
        setLoadingTags(true);
        ExhibitorCategoryApi.find<ExhibitorCategory>()
            .then(({ response }) => {
                if (response !== null) {
                    setOptionTags(
                        response.items.map((item) => {
                            return {
                                label: item.name,
                                value: item.id,
                            };
                        })
                    );
                }
            })
            .finally(() => {
                setLoadingTags(false);
            });
    }, []);

    return (
        <>
            {isGrantedControl ? (
                <Row className={"mb-2"}>
                    <Col className="d-flex justify-content-end">
                        <AppFormDropdown
                            className={"mr-1"}
                            id={"tagFilter"}
                            defaultValue={null}
                            menuPlacement={"bottom"}
                            options={optionTags}
                            onChange={(e) => {
                                if (e) {
                                    const { value } = e as DropDownOption;
                                    setSelectedTag(value);
                                    setPage(1);
                                }
                            }}
                            isLoading={loadingTags}
                        />
                        <AppButton
                            className={"text-capitalize"}
                            variant={"secondary"}
                            onClick={() => {
                                navigate(
                                    `/admin/exhibitors/${id}/products/new`
                                );
                            }}
                        >
                            + {t("common.button:create")}
                        </AppButton>
                    </Col>
                </Row>
            ) : (
                <></>
            )}
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
