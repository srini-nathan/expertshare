import React, { FC, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import {
    Col,
    Container,
    Row,
    Table,
    FormControl,
    Tabs,
    Tab,
} from "react-bootstrap";

const enabledLanguages = ["de", "fr", "gj"];
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
    name: string;
    translations: {
        [translationKey: string]: {
            [locale: string]: string;
        };
    };
}

const translationGroups: { [key: string]: TranslationGroup } = {
    "global-text": {
        name: "Global Text",
        translations: {
            ok: {
                default: "OK",
                de: "De - OK",
                fr: "De - OK",
                gj: "De - OK",
            },
            cancel: {
                default: "Cancel",
                de: "De - Cancel",
                fr: "De - Cancel",
                gj: "De - Cancel",
            },
        },
    },
    "global-form-validation": {
        name: "Global Form Validation",
        translations: {
            "field-is-required": {
                default: "%fieldName% is required",
                de: "De - %fieldName% is required",
                fr: "De - %fieldName% is required",
                gj: "De - %fieldName% is required",
            },
            "accept-term-and-conditions": {
                default: "You must accept our terms & conditions",
                de: "De - You must accept our terms & conditions",
                fr: "De - You must accept our terms & conditions",
                gj: "De - You must accept our terms & conditions",
            },
        },
    },
    "page-login": {
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
    "page-register": {
        name: "Register Page",
        translations: {
            "first-name": {
                default: "Username",
                de: "DE - Username",
                fr: "FR - Username",
                gj: "GJ - Username",
            },
            "last-name": {
                default: "Password",
                de: "DE - Password",
                fr: "FR - Password",
                gj: "GJ - Password",
            },
        },
    },
    "page-forgot-password": {
        name: "Forgot Password Page",
        translations: {
            "click-here-resend-email": {
                default: "Click here to resend email",
                de: "DE - Click here to resend email",
                fr: "FR - Click here to resend email",
                gj: "GJ - Click here to resend email",
            },
        },
    },
    "page-dashboard": {
        name: "Dashboard",
        translations: {
            "greeting-message": {
                default: "Welcome %name ",
                de: "DE - Welcome %name ",
                fr: "FR - Welcome %name ",
                gj: "GJ - Welcome %name ",
            },
        },
    },
};

const getName = (key: string): string => {
    return translationGroups[key].name;
};

// const updateTranslationValue = (
//     groupKey: string,
//     translationKey: string,
//     locale: string,
//     value: string
// ): void => {
//     translationGroups[groupKey].translations[translationKey][locale] = [value];
// };

export const TranslationAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const [activeGroupKey, setActiveGroupKey] = useState<string | null>(
        "global-text"
    );

    return (
        <Container fluid={true} className="pt-4">
            <Row>
                <Col xs={12} xl={12}>
                    <Tabs
                        id="controlled-translation-group-tabs"
                        activeKey={activeGroupKey}
                        onSelect={(k) => setActiveGroupKey(k)}
                    >
                        {Object.keys(translationGroups).map((key: string) => {
                            const { translations } = translationGroups[key];
                            const translationKeys = Object.keys(translations);
                            return (
                                <Tab eventKey={key} title={getName(key)}>
                                    <Table striped bordered hover responsive>
                                        <TranslationTableHeaders />
                                        <tbody>
                                            {translationKeys.map(
                                                (translationKey) => {
                                                    const defaultValue =
                                                        translations[
                                                            translationKey
                                                        ].default;
                                                    return (
                                                        <tr
                                                            key={translationKey}
                                                        >
                                                            <th>
                                                                {translationKey}
                                                            </th>
                                                            <td>
                                                                {defaultValue}
                                                            </td>
                                                            {enabledLanguages.map(
                                                                (locale) => {
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
                                </Tab>
                            );
                        })}
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};
