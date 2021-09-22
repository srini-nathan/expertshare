import React, { FC, useEffect, useRef, useState } from "react";
import { Canceler } from "axios";
import { Row } from "react-bootstrap";
import {
    AppExhibitorProductCard,
    AppFormDropdown,
    AppGridPagination,
    AppLoader,
} from "../../components";
import { ExhibitorProductApi } from "../../../AdminModule/apis";
import { ExhibitorProduct } from "../../../AdminModule/models";
import { useAuthState } from "../../hooks";
import { defaultPageSize, pageSizeOptions } from "../../containers/AppGrid";
import "./assets/scss/style.scss";

export interface ProductsWidgetType {
    id: number;
}

export const ProductsWidget: FC<ProductsWidgetType> = ({ id }): JSX.Element => {
    const { containerId } = useAuthState();
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [data, setData] = useState<ExhibitorProduct[]>([]);
    const [pageSize, setPageSize] = useState<number>(30);
    const [page, setPage] = useState<number>(1);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);

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
        <div className={"products-widget"}>
            <Row className="mt-4">
                {loading ? (
                    <AppLoader />
                ) : (
                    data.map((e) => (
                        <AppExhibitorProductCard
                            key={e.id}
                            data={e}
                            isGrantedControl={false}
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
        </div>
    );
};
