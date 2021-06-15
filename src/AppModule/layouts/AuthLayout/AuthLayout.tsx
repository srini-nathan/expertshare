import React, { FC, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useUserLocale } from "../../hooks";

export const AuthLayout: FC = ({ children }) => {
    const { locale, setLocale, containerLocale } = useUserLocale();
    useEffect(() => {
        if (locale === "") {
            setLocale(containerLocale);
        }
    });

    return (
        <Container className={"p-0"} fluid={true}>
            {children}
        </Container>
    );
};
