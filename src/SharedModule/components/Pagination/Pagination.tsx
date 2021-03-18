import React, { FC, Fragment } from "react";
import { Link } from "@reach/router";
import { ChevronLeft, ChevronRight } from "react-feather";
import "./style.scss";

export interface PaginationProps {
    totalRows: number;
    currentPage: number;
    pageLimit: number;
    onPageChange(arg1: number): void;
}

const range = (from: number, to: number, step = 1) => {
    let i = from;
    const rangeArray = [];

    while (i <= to) {
        rangeArray.push(i);
        i += step;
    }

    return rangeArray;
};
const fetchPageNumbers = (
    totalPages: number,
    currentPage: number,
    pageNeighbours: number
) => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
        const startPage = Math.max(2, currentPage - pageNeighbours);
        const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
        let pages = range(startPage, endPage);
        const hasLeftSpill = startPage > 2;
        const hasRightSpill = totalPages - endPage > 1;
        const spillOffset = totalNumbers - (pages.length + 1);

        switch (true) {
            case hasLeftSpill && !hasRightSpill: {
                const extraPages = range(startPage - spillOffset, startPage);
                pages = [...extraPages, ...pages];
                break;
            }

            case !hasLeftSpill && hasRightSpill: {
                const extraPages = range(endPage + 1, endPage + spillOffset);
                pages = [...pages, ...extraPages];
                break;
            }

            case hasLeftSpill && hasRightSpill:
            default: {
                pages = [...pages];
                break;
            }
        }

        return [1, ...pages, "dot", totalPages];
    }

    return range(1, totalPages);
};
const getPageNumbers = (
    totalRows: number,
    currentPage: number,
    pageLimit: number,
    callBack: any
) => {
    let pageNeighbours = 2;
    const totalPages = Math.ceil(totalRows / pageLimit);
    pageNeighbours =
        typeof pageNeighbours === "number"
            ? Math.max(0, Math.min(pageNeighbours, 2))
            : 0;
    const pages = fetchPageNumbers(totalPages, currentPage, pageNeighbours);

    return (
        <Fragment>
            {pages.map((page, index) => {
                return (
                    <li key={index} className="page-item">
                        {page === "dot" ? (
                            <span>...</span>
                        ) : (
                            <Link
                                onClick={() => callBack(page)}
                                className={
                                    page === currentPage
                                        ? "page-link active"
                                        : "page-link"
                                }
                                to=""
                            >
                                {page}
                            </Link>
                        )}
                    </li>
                );
            })}
        </Fragment>
    );
};

export const Pagination: FC<PaginationProps> = ({
    totalRows,
    pageLimit,
    currentPage,
    onPageChange,
}): JSX.Element => {
    const callBack = (page: number): void => {
        onPageChange(page);
    };
    return (
        <div className="col-md-12 mt-3">
            <nav aria-label="Page navigation">
                <ul className="pagination float-right">
                    <li className="page-item">
                        <Link
                            onClick={() => onPageChange(currentPage - 1)}
                            className="page-link"
                            to=""
                        >
                            <ChevronLeft />
                        </Link>
                    </li>
                    {getPageNumbers(
                        totalRows,
                        currentPage,
                        pageLimit,
                        callBack
                    )}
                    <li className="page-item">
                        <Link
                            onClick={() => onPageChange(currentPage + 1)}
                            className="page-link"
                            to=""
                        >
                            <ChevronRight />
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="total-records float-right">
                <span>Total Records: {totalRows}</span>
            </div>
        </div>
    );
};
