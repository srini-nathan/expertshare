import React, { FC, useEffect, useRef } from "react";
import { Canceler } from "axios";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

export interface AppMessageInboxFiltersProps {
    onQuickFilterChange: (s: string) => void;
    cancelTokenSources: Canceler[];
}

export const AppMessageInboxFilters: FC<AppMessageInboxFiltersProps> = ({
    cancelTokenSources,
    onQuickFilterChange,
}) => {
    const search$ = useRef(new Subject<string>());
    const destroy$ = new Subject<string>();

    useEffect(() => {
        search$.current
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(destroy$)
            )
            .subscribe((search: string) => {
                while (cancelTokenSources.length > 0) {
                    const c = cancelTokenSources.shift();
                    if (c) {
                        c();
                    }
                }
                onQuickFilterChange(search);
            });
        return () => {
            destroy$.next();
            destroy$.complete();
        };
    });

    function handleQuickSearch(event: React.ChangeEvent<HTMLInputElement>) {
        search$.current.next(event.currentTarget.value);
    }

    return (
        <>
            <div className="row m-0 px-3 pt-3 pb-1">
                <div className="inner-container--search col-12 p-0">
                    <div className="inner-container--search--container">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-100"
                            onChange={handleQuickSearch}
                        />
                        <i className="fak fa-search-light"></i>
                    </div>
                </div>
            </div>
        </>
    );
};
