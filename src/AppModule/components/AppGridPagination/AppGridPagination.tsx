import React, { FC } from "react";
import { Pagination, Row, Col, Dropdown } from "react-bootstrap";
import "./assets/scss/style.scss";
import { AppIcon } from "../AppIcon";

export interface AppGridPaginationProps {
    itemsPerPage?: number;
    totalItems?: number;
    active?: number;
    firstLastCtrl?: boolean;
    nextPrevCtrl?: boolean;
    onClick?: (pageNumber: number) => void;
    className?: string;
}

export const AppGridPagination: FC<AppGridPaginationProps> = ({
    itemsPerPage = 1,
    totalItems = 0,
    active = 1,
    firstLastCtrl = false,
    nextPrevCtrl = true,
    onClick = () => {},
    className = "d-flex justify-content-end",
}): JSX.Element => {
    if (totalItems === 0) {
        return <Pagination />;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const delta = 2;
    const left = active - delta;
    const right = active + delta + 1;
    const range = [];
    const pages = [];
    let l;

    for (let i = 1; i <= totalPages; i += 1) {
        if (i === 1 || i === totalPages || (i >= left && i < right)) {
            range.push(i);
        }
    }

    if (firstLastCtrl) {
        pages.push(
            <Pagination.First
                key={"pageFirst"}
                disabled={active === 1}
                onClick={() => onClick(1)}
            />
        );
    }

    if (nextPrevCtrl) {
        pages.push(
            <Pagination.Prev
                key={"pagePrev"}
                disabled={active === 1}
                onClick={() => onClick(active - 1)}
            >
                <AppIcon name={"back"} />
            </Pagination.Prev>
        );
    }

    for (let i1 = 0; i1 < range.length; i1 += 1) {
        const i = range[i1];
        if (l) {
            if (i - l === 2) {
                const page = l + 1;
                pages.push(
                    <Pagination.Item
                        key={`page${page}`}
                        active={page === active}
                        onClick={() => onClick(page)}
                    >
                        {page}
                    </Pagination.Item>
                );
            } else if (i - l !== 1) {
                pages.push(<Pagination.Ellipsis key={`page${i - l}`} />);
            }
        }
        pages.push(
            <Pagination.Item
                key={`page${i}`}
                active={i === active}
                onClick={() => onClick(i)}
            >
                {i}
            </Pagination.Item>
        );
        l = i;
    }

    if (nextPrevCtrl) {
        pages.push(
            <Pagination.Next
                key={"pageNext"}
                disabled={active === totalPages}
                onClick={() => onClick(active + 1)}
            >
                <AppIcon name={"next"} />
            </Pagination.Next>
        );
    }

    if (firstLastCtrl) {
        pages.push(
            <Pagination.Last
                key={"pageLast"}
                disabled={active === totalPages}
                onClick={() => onClick(totalPages)}
            />
        );
    }

    return (
        <Col className="pagination-container p-0">
            <Row>
                <Col md={6}>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="secondary"
                            id="dropdown-basic"
                        >
                            20 Rows
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>10 Rows</Dropdown.Item>
                            <Dropdown.Item>20 Rows</Dropdown.Item>
                            <Dropdown.Item>30 Rows</Dropdown.Item>
                            <Dropdown.Item>40 Rows</Dropdown.Item>
                            <Dropdown.Item>50 Rows</Dropdown.Item>
                            <Dropdown.Item>60 Rows</Dropdown.Item>
                            <Dropdown.Item>70 Rows</Dropdown.Item>
                            <Dropdown.Item>80 Rows</Dropdown.Item>
                            <Dropdown.Item>90 Rows</Dropdown.Item>
                            <Dropdown.Item>100 Rows</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>

                {totalPages > 1 && (
                    <Col md={6}>
                        <Pagination className={className}>{pages}</Pagination>
                    </Col>
                )}
            </Row>
        </Col>
    );
};
