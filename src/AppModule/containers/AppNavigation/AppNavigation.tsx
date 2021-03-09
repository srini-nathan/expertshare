import React, { FC } from "react";
import { Link } from "@reach/router";
import { AppNavigationItemProps } from "../../components/AppNavigationItem";

interface AppNavigationProps {
    items: AppNavigationItemProps[];
}

const AppNavigation: FC<AppNavigationProps> = ({ items }) => {
    return (
        <div className="list-group">
            {items.map(({ label, path }) => {
                return (
                    <Link
                        key={label}
                        to={path}
                        className="list-group-item list-group-item-action"
                    >
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{label}</h5>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default AppNavigation;
