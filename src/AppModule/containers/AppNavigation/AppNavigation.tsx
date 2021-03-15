import React, { FC } from "react";
import { ListGroup } from "react-bootstrap";
import styled from "styled-components";
import {
    AppNavigationItem,
    AppNavigationItemProps,
} from "../../components/AppNavigationItem";
import theme from "../../themes";

interface AppNavigationProps {
    items: AppNavigationItemProps[];
}

const { navigation } = theme;

const Wrapper = styled.aside`
    background-color: ${navigation.bgColor};
    color: ${navigation.fgColor};
`;

const AppNavigation: FC<AppNavigationProps> = ({ items }) => {
    return (
        <Wrapper className={"min-vh-100 position-fixed"}>
            <ListGroup>
                {items.map(({ label, path, icon }) => {
                    return (
                        <AppNavigationItem
                            label={label}
                            path={path}
                            icon={icon}
                            key={label}
                        ></AppNavigationItem>
                    );
                })}
            </ListGroup>
        </Wrapper>
    );
};

export default AppNavigation;
