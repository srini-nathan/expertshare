import React, { FC } from "react";

export interface AppMessageInboxFiltersProps {
    onQuickSearch?: (query: string) => void;
}

export const AppMessageInboxFilters: FC<AppMessageInboxFiltersProps> = () => {
    return (
        <>
            <div className="row m-0 px-3 pt-3 pb-1">
                <div className="inner-container--search col-12 p-0">
                    <div className="inner-container--search--container">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-100"
                        />
                        <i className="fak fa-search-light"></i>
                    </div>
                </div>
            </div>
        </>
    );
};
