import React, { FC } from "react";
import { SimpleObject } from "../../models";
import "./assets/scss/style.scss";
import { AppIcon } from "../AppIcon";
import { AppFormLabel } from "../AppFormLabel";

export interface AppTagSelectProps {
    label?: string;
    description?: string;
    options: SimpleObject<string>[];
    selectedItems: SimpleObject<string>[];
    required?: boolean;
    onChange: (item: SimpleObject<string>) => void;
}

export const AppTagSelect: FC<AppTagSelectProps> = ({
    label = "",
    required = false,
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
                let checked = false;
                selectedItems.filter((item) => {
                    if (item.id === e.id) {
                        checked = true;
                    }

                    return item;
                });
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
                <div className="list-item m-2" key={i}>
                    <span onClick={() => onChange(e)}>
                        <AppIcon name={"X"} />
                    </span>
                    <span>{e.label}</span>
                </div>
            );
        });
    };

    return (
        <div className="custom-select-tag">
            <span className="custom-select-tag-title">
                <AppFormLabel
                    label={label}
                    required={required}
                    description={description}
                />
            </span>

            <div className="custom-select-tag-container py-3">
                <div className="custom-select-tag-container-search px-3">
                    <AppIcon name={"Search"} />
                    <input
                        className="custom-select-tag-container-search-input form-control"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Sreach..."
                    />
                </div>
                <ul className="list-group mx-3">{renderOptions()}</ul>
                <div className="selected-item-container row">
                    {renderSelectedItems()}
                </div>
            </div>
        </div>
    );
};
