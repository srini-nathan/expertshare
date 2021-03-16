import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import {
    Accordion,
    Card,
    Col,
    Container,
    Row,
    Table,
    FormControl,
} from "react-bootstrap";

const enabledLanguages = ["de", "fr", "gj"];
const TranslationGroupHeader: FC = ({ children }) => <h5>{children}</h5>;
const TranslationTableHeaders: FC = () => (
    <thead>
        <tr>
            <th>Key</th>
            <th>Default</th>
            {enabledLanguages.map((locale) => (
                <th key={locale}>{locale.toUpperCase()}</th>
            ))}
        </tr>
    </thead>
);

interface TranslationGroup {
    key: string;
    name: string;
    translations: {
        [key: string]: {
            default: string;
            [key: string]: string;
        };
    };
}

const translationGroups: TranslationGroup[] = [
    {
        key: "loginPage",
        name: "Login Page",
        translations: {
            username: {
                default: "Username",
                de: "De - Username",
                fr: "De - Username",
                gj: "De - Username",
            },
            password: {
                default: "Password",
                de: "De - Password",
                fr: "De - Password",
                gj: "De - Password",
            },
        },
    },
    {
        key: "registerPage",
        name: "Register Page",
        translations: {
            firstName: {
                default: "Username",
                de: "DE - Username",
                fr: "FR - Username",
                gj: "GJ - Username",
            },
            lastName: {
                default: "Password",
                de: "DE - Password",
                fr: "FR - Password",
                gj: "GJ - Password",
            },
        },
    },
    {
        key: "forgotPasswordPage",
        name: "Forgot Password Page",
        translations: {
            clickHereResendEmail: {
                default: "Click here to resend email",
                de: "DE - Click here to resend email",
                fr: "FR - Click here to resend email",
                gj: "GJ - Click here to resend email",
            },
        },
    },
    {
        key: "dashboard",
        name: "Dashboard",
        translations: {
            greetingMessage: {
                default: "Welcome %name ",
                de: "DE - Welcome %name ",
                fr: "FR - Welcome %name ",
                gj: "GJ - Welcome %name ",
            },
        },
    },
];

export const TranslationEditor: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Container fluid={true} className="pt-4">
            <Row>
                <Col xs={12} xl={12}>
                    <Accordion>
                        {translationGroups.map(
                            ({ key, name, translations }) => (
                                <Card key={key}>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey={key}
                                    >
                                        <TranslationGroupHeader>
                                            {name}
                                        </TranslationGroupHeader>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={key}>
                                        <Table
                                            striped
                                            bordered
                                            hover
                                            responsive
                                        >
                                            <TranslationTableHeaders />
                                            <tbody>
                                                {Object.keys(translations).map(
                                                    (translationKey) => {
                                                        const defaultValue =
                                                            translations[
                                                                translationKey
                                                            ].default;
                                                        return (
                                                            <tr
                                                                key={
                                                                    translationKey
                                                                }
                                                            >
                                                                <th>
                                                                    {
                                                                        translationKey
                                                                    }
                                                                </th>
                                                                <td>
                                                                    {
                                                                        defaultValue
                                                                    }
                                                                </td>
                                                                {enabledLanguages.map(
                                                                    (
                                                                        locale
                                                                    ) => {
                                                                        const localeValue =
                                                                            translations[
                                                                                translationKey
                                                                            ][
                                                                                locale
                                                                            ];
                                                                        return (
                                                                            <td
                                                                                key={`${key}${translationKey}${locale}`}
                                                                            >
                                                                                <FormControl
                                                                                    value={
                                                                                        localeValue
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        );
                                                                    }
                                                                )}
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </Table>
                                    </Accordion.Collapse>
                                </Card>
                            )
                        )}
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
};
