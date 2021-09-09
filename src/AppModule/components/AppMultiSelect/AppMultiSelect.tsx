import React, { FC } from "react";
import "./assets/scss/style.scss";
import { AppIcon } from "../AppIcon";
import { AppFormLabel } from "../AppFormLabel";

export interface AppMultiSelectProps {
    label?: string;
    description?: string;
    placeholder: string;
    options: string[];
    selectedItems: string[];
    required?: boolean;
    onChange: (item: string) => void;
    onBlurHandler?: (value: React.FocusEvent<HTMLInputElement>) => void;
}

export const AppMultiSelect: FC<AppMultiSelectProps> = ({
    label = "",
    required = false,
    description,
    placeholder,
    options,
    selectedItems,
    onChange,
    onBlurHandler,
}): JSX.Element => {
    const [searchText, setSearchText] = React.useState<string>("");
    const renderOptions = () => {
        return options
            .filter((e: string) =>
                e
                    .trim()
                    .toLowerCase()
                    .includes(searchText.trim().toLowerCase(), 0)
            )
            .map((e, i) => {
                let checked = false;
                if (selectedItems.indexOf(e) !== -1) {
                    checked = true;
                }
                return (
                    <li className="list-group-item" key={i}>
                        <label className="checkbox-label-container">
                            <input
                                onChange={() => onChange(e)}
                                type="checkbox"
                                checked={checked}
                            ></input>
                            <span className="custom-checkbox"></span>
                            {e}
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
                    <span>{e}</span>
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
                        placeholder={placeholder}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            if (onBlurHandler) onBlurHandler(e);
                        }}
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
