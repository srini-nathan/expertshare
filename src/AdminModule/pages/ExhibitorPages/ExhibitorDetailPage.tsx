import { FC, useEffect, useState, Fragment, useRef } from "react";
import { Link, RouteComponentProps, useParams, useMatch } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Canceler } from "axios";
import {
    AppLoader,
    AppQuestionsAndAnswers,
} from "../../../AppModule/components";
import { errorToast, getBGStyle, resolveImage } from "../../../AppModule/utils";
import "./assets/scss/detail.scss";

import { ExhibitorApi, ExhibitorProductApi } from "../../apis";
import { Exhibitor, ExhibitorProduct, User } from "../../models";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
    ROLES,
} from "../../../config";
import placeholder from "../../../AppModule/assets/images/imgthumb.svg";
import {
    useAuthState,
    useBuildAssetPath,
    useIsGranted,
} from "../../../AppModule/hooks";
import { ExhibitorCommentsAPI } from "../../../AppModule/apis";

import { ExhibitorDetailTabs } from "./ExhibitorDetailTabs";
import { ExhibitorDetailTabDetails } from "./ExhibitorDetailTabDetails";
import { ExhibitorDetailTabProducts } from "./ExhibitorDetailTabProducts";

export const ExhibitorDetailPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const adminPage = useMatch("/admin/exhibitors/:id/detail");
    const isFrontPage = adminPage === null;
    const { id, view = "details" } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const [loadingProducts, isLoadingProducts] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor>();
    const { containerId } = useAuthState();
    const imagePath = useBuildAssetPath(ExhibitorPosterFileInfo);
    const logoPath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);
    const [members, setMembers] = useState<User[]>([]);
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);
    const [activeTab, setActiveTab] = useState<string>(view);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [exhibitorProduct, setExhibitorProduct] = useState<
        ExhibitorProduct[]
    >([]);
    const [productsTotalCount, setProductsTotalCount] = useState<number>(0);

    const fetchExhibitorProduct = () => {
        isLoadingProducts(true);
        ExhibitorProductApi.find<ExhibitorProduct>(
            1,
            {
                "exhibitor.id": id,
                "container.id": containerId,
            },
            (c) => {
                cancelTokenSourcesRef.current.push(c);
            }
        )
            .then(({ response }) => {
                if (response !== null) {
                    setExhibitorProduct(response.items);
                    setProductsTotalCount(response.totalItems);
                }
            })
            .finally(() => {
                isLoadingProducts(false);
            });
    };

    useEffect(() => {
        isLoading(true);
        ExhibitorApi.findById<Exhibitor>(id).then(
            ({ response, isNotFound }) => {
                if (isNotFound) {
                    errorToast(t("exhibitor.detail:error.message.notExist"));
                } else if (response !== null) {
                    setData(response);
                    const users = response?.members ?? [];
                    setMembers(users as User[]);
                }
                isLoading(false);
            }
        );
        fetchExhibitorProduct();
    }, [id]);

    if (loading || loadingProducts) {
        return <AppLoader />;
    }

    const style = getBGStyle(logoPath, data?.logoImageName, placeholder);
    const poster = resolveImage(imagePath, data?.coverImageName, placeholder);

    return (
        <Fragment>
            <Row className="m-0 exhibitor-detail">
                <Col
                    className={
                        data?.isCommentEnable
                            ? "pl-0 pr-0 pr-lg-3 pr-xl-2 comment-enable"
                            : "px-0"
                    }
                    md={12}
                    sm={12}
                    lg={data?.isCommentEnable ? 8 : 12}
                >
                    <Row className="m-0 card mb-3 mb-lg-4 exhibitors-header">
                        <Col xs={12}>
                            <div className="row exhibitors-header--detail mb-3 px-2 pt-4">
                                <div className="col-auto exhibitors-header--detail--left-buttons d-flex">
                                    <Link
                                        to={
                                            isFrontPage
                                                ? "/exhibitors"
                                                : "/admin/exhibitors"
                                        }
                                        className="back-btn btn btn-secondary mr-3"
                                    >
                                        <i className="fak fa-chevron-left mr-3"></i>
                                        {t("exhibitor.detail:button.back")}
                                    </Link>
                                </div>
                                {isGrantedControl && (
                                    <div className="col-auto exhibitors-header--detail--right-buttons d-flex mr-0 ml-auto">
                                        <Link
                                            to={`/admin/exhibitors/${id}`}
                                            className="btn btn-secondary edit-btn ml-2"
                                        >
                                            <i className="fak fa-pen-regular mb-1"></i>
                                        </Link>
                                    </div>
                                )}
                                <div className="col-12 exhibitors-header--detail--title mt-4">
                                    <h1>{data?.name}</h1>
                                </div>
                            </div>
                            <div className="row exhibitors-header--banner">
                                <div className="col-12 p-0">
                                    <div className="sponsor">
                                        {data?.logoImageName ? (
                                            <i style={style}></i>
                                        ) : null}
                                    </div>
                                    <img
                                        src={poster}
                                        className={
                                            data?.coverImageName
                                                ? ""
                                                : "placeholderImg"
                                        }
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <ExhibitorDetailTabs
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            if (navigate) {
                                setActiveTab(tab);
                                const pageUrl = isFrontPage
                                    ? `/exhibitors/${id}/detail/${tab}`
                                    : `/admin/exhibitors/${id}/detail/${tab}`;
                                navigate(pageUrl);
                            }
                        }}
                        productsTotalCount={productsTotalCount}
                    />
                    {data && activeTab === "details" ? (
                        <ExhibitorDetailTabDetails
                            data={data}
                            members={members}
                        />
                    ) : null}
                    {data && activeTab === "products" ? (
                        <ExhibitorDetailTabProducts
                            exhibitor={data}
                            exhibitorProduct={exhibitorProduct}
                            productsTotalCount={productsTotalCount}
                        />
                    ) : null}
                </Col>
                {data?.isCommentEnable && (
                    <Col md={12} sm={12} lg={4} className="pr-0 pl-0 pl-lg-3">
                        <AppQuestionsAndAnswers
                            name={t(
                                "exhibitor.detail:section.questionAndAnswers"
                            )}
                            parentId={id}
                            socketParentId={`exhibitor_${id}`}
                            container={containerId}
                            commentsAPI={ExhibitorCommentsAPI}
                            parentElement="/api/exhibitor_comments"
                            mainElement="api/exhibitors"
                        />
                    </Col>
                )}
            </Row>
        </Fragment>
    );
};
