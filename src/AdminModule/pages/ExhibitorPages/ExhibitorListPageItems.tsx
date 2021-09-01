import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { AppExhibitorCard } from "../../../AppModule/components/AppExhibitorCard";
import { useIsGranted } from "../../../AppModule/hooks";
import { SimpleObject } from "../../../AppModule/models";
import { ROLES } from "../../../config";
import { Exhibitor } from "../../models";

interface ExhibitorListItemsType {
    isFrontPage: boolean;
    catWiseData: SimpleObject<Exhibitor[]>;
    data: Exhibitor[];
    setDeleteShow: (id: number) => void;
}

export const ExhibitorListItems: FC<ExhibitorListItemsType> = ({
    isFrontPage,
    catWiseData,
    data,
    setDeleteShow,
}) => {
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);
    const cats = Object.keys(catWiseData);

    if (isFrontPage) {
        return (
            <>
                {cats.map((catName) => {
                    const items = catWiseData[catName];
                    return (
                        <Row>
                            <Col sm={12}>
                                <h4 className="pb-1 pt-3">{catName}</h4>
                            </Col>
                            {items.map((e) => (
                                <AppExhibitorCard
                                    key={e.id}
                                    data={e}
                                    isGrantedControl={isGrantedControl}
                                    handleDelete={(id) => {
                                        setDeleteShow(id);
                                    }}
                                    handleClone={() => {}}
                                    detailLink={`/exhibitors/${e.id}/detail`}
                                />
                            ))}
                        </Row>
                    );
                })}
            </>
        );
    }

    return (
        <Row>
            {data.map((e) => (
                <AppExhibitorCard
                    key={e.id}
                    data={e}
                    isGrantedControl={isGrantedControl}
                    handleDelete={(id) => {
                        setDeleteShow(id);
                    }}
                    handleClone={() => {}}
                    detailLink={`/admin/exhibitors/${e.id}/detail`}
                />
            ))}
        </Row>
    );
};
