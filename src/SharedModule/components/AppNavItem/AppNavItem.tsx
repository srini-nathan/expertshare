import React from "react";
import {
    Nav,
    NavItem,
    NavLink,
    NavDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "@bootstrap-styled/v4";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppNavItemProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AppNavItem: React.FC<AppNavItemProps> = () => {
    const [initialState, setInitialState] = React.useState({
        isOpen: false,
    });

    return (
        <Nav tabs>
            <NavItem>
                <NavLink active href="/">
                    Active
                </NavLink>
            </NavItem>
            <NavDropdown
                isOpen={initialState.isOpen}
                toggle={() => setInitialState({ isOpen: !initialState.isOpen })}
            >
                <DropdownToggle caret nav>
                    Dropdown
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Header</DropdownItem>
                    <DropdownItem disabled>Action</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
            </NavDropdown>
            <NavItem>
                <NavLink href="/about">Link</NavLink>
            </NavItem>
            <NavItem>
                <NavLink disabled href="/home">
                    Disabled
                </NavLink>
            </NavItem>
        </Nav>
    );
};
