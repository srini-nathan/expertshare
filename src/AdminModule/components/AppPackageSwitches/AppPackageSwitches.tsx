import React, { FC, Fragment, useState } from "react";
import { Control } from "react-hook-form";
import { AppFormSwitch } from "../../../AppModule/components";
import { checkAndAdd, checkAndRemove } from "../../../AppModule/utils";
import { PackageApi } from "../../apis";
import { Package } from "../../models";

export interface AppPackageSwitchesProps {
    packages: Package[];
    activePacks: string[];
    onChange: (activePacks: string[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
}

export const AppPackageSwitches: FC<AppPackageSwitchesProps> = ({
    packages,
    activePacks,
    onChange = () => {},
    control,
}): JSX.Element => {
    const [data, setData] = useState<string[]>(activePacks);

    const isPackageActive = (resourceUrl: string): boolean => {
        return activePacks.indexOf(resourceUrl) > -1;
    };

    return (
        <Fragment>
            {packages.map(({ packageKey, id: packId }) => {
                const name = packageKey.replace(".", "_");
                const resourceUrl = PackageApi.toResourceUrl(packId as number);
                return (
                    <AppFormSwitch
                        key={name}
                        name={name}
                        label={packageKey}
                        control={control}
                        defaultChecked={isPackageActive(resourceUrl)}
                        onChange={(event) => {
                            const mutableData = data as string[];
                            if (event.currentTarget.checked) {
                                checkAndAdd<string>(mutableData, resourceUrl);
                            } else {
                                checkAndRemove<string>(
                                    mutableData,
                                    resourceUrl
                                );
                            }
                            setData(mutableData);
                            onChange(mutableData);
                        }}
                    />
                );
            })}
        </Fragment>
    );
};
