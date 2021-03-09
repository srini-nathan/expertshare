import React, { FC } from "react";
import { Container } from "react-bootstrap";

export const AuthLayout: FC = ({ children }) => {
    return (
        <Container className={"p-0"} fluid={true}>
            {children}
        </Container>
    );
};
