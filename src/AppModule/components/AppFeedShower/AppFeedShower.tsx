import React, { FC } from "react";

export interface AppFeedShowerProps {
    url?: string;
}

export const AppFeedShower: FC<AppFeedShowerProps> = (): JSX.Element => {
    return (
        <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor
            corporis cum, consequuntur nemo quam dolorum minima iure neque,
            facere minus quo! Harum, quia nisi ipsum ex incidunt laudantium fuga
            sed.
        </div>
    );
};
