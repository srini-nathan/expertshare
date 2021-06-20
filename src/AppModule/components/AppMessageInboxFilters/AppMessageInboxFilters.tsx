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
            <div className="row m-0 px-3 pt-1 pb-2">
                <div className="inner-container--tab col-auto p-0">
                    <div className="row m-0 p-0">
                        <div className="inner-container--tab--item active all-users col-auto pl-0 pr-1">
                            <a href="#" className="px-3">
                                <i className="fak fa-users"></i>
                                All Users
                            </a>
                        </div>
                        <div className="inner-container--tab--item online-only col-auto pl-0 pr-1">
                            <a href="#" className="px-3">
                                <i className="fak fa-live"></i>
                                Online Only
                            </a>
                        </div>
                    </div>
                </div>
                <div className="inner-container--filter col-auto p-0 mr-0 ml-auto">
                    <a href="#">
                        <i className="fak fa-filter-light"></i>
                    </a>
                </div>
            </div>
        </>
    );
};
