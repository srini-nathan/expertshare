import React, { FunctionComponent } from "react";
import "./style.scss";
import ceo from "../assets/images/ceo.jpg";
import { AppAvatar } from "../../AppModule/components/AppAvatar/AppAvatar";

interface OwnProps {
    className?: string;
}

type Props = OwnProps;

const InfoPanel: FunctionComponent<Props> = (props) => {
    return (
        <div className={`${props.className ?? ""} info-section`}>
            <div className="m-auto container text-white info-details ">
                <h2 className={"mb-4"}>
                    The best place for experience exchange.
                </h2>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <div className="person d-flex">
                    <AppAvatar roundedCircle src={ceo} />
                    <div className="person-details d-block">
                        <b className="d-block">Samantha smith</b>
                        <span className="d-block">CEO</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPanel;
