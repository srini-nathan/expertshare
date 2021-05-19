import React, { FC } from "react";
import { SimpleObject } from "../../models";
import "./assets/scss/style.scss";
import { AppIcon } from "../AppIcon";

export interface AppTagSelectProps {
    label: string;
    description?: string;
    options: SimpleObject<string>[];
    selectedItems: SimpleObject<string>[];
    require?: boolean;
    onChange: (item: SimpleObject<string>) => void;
}

export const AppTagSelect: FC<AppTagSelectProps> = ({
    label,
    require,
    description,
    options,
    selectedItems,
    onChange,
}): JSX.Element => {
    const [searchText, setSearchText] = React.useState<string>("");
    const renderOptions = () => {
        return options
            .filter((e) =>
                e.label
                    .trim()
                    .toLowerCase()
                    .includes(searchText.trim().toLowerCase(), 0)
            )
            .map((e, i) => {
                const checked = selectedItems.indexOf(e) >= 0;

                return (
                    <li className="list-group-item" key={i}>
                        <label className="checkbox-label-container">
                            <input
                                onChange={() => onChange(e)}
                                type="checkbox"
                                checked={checked}
                            ></input>
                            <span className="custom-checkbox"></span>
                            {e.label}
                        </label>
                    </li>
                );
            });
    };

    const renderSelectedItems = () => {
        return selectedItems.map((e, i) => {
            return (
                <div className="list-item" key={i}>
                    <span>{e.label}</span>
                    <span onClick={() => onChange(e)}>
                        <AppIcon name={"X"} />
                    </span>
                </div>
            );
        });
    };

    return (
        <div className="custom-select-tag">
            <span className="custom-select-title">
                {label}
                {require && <span className="custom-select-required">*</span>}
                {description && (
                    <div className="custom-select-description">
                        <span>i</span>
                        <div className="custom-select-description-content">
                            <h3>Category</h3>
                            <div>{description}</div>
                        </div>
                    </div>
                )}
            </span>

            <div className="custom-select-container">
                <div className="custom-select-container-search">
                    <AppIcon name={"Search"} />
                    <input
                        className="custom-select-container-search-input form-control"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Quick Sreach..."
                    />
                </div>
                <ul className="list-group">{renderOptions()}</ul>
                <div className="selected-item-container row">
                    {renderSelectedItems()}
                </div>
            </div>
        </div>
    );
};
