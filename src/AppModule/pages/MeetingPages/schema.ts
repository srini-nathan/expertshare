import * as yup from "yup";
import { MEETING_TYPE } from "../../../config";

const validations = {
    name: {
        max: 255,
    },
};

const schema = () => {
    return yup.object().shape({
        name: yup.string().required().max(validations.name.max),
        description: yup.string(),
        providerUrl: yup.string().url().required(),
        type: yup.string().required(),
        startDate: yup.date().required(),
        endDate: yup
            .date()
            .min(
                yup.ref("startDate"),
                "End date must be greater than start date"
            )
            .required(),
        repeatWeek: yup
            .number()
            .when("type", {
                is: (val) => MEETING_TYPE.TYPE_SINGLE === val,
                then: yup.number().min(1).required(),
            })
            .when("type", {
                is: (val) => MEETING_TYPE.TYPE_REPEAT_WEEKLY === val,
                then: yup.number().min(2).required(),
            }),
        duration: yup
            .array()
            .of(
                yup.object().shape({
                    hours: yup.number().min(0).max(24),
                    minutes: yup.number().min(5).max(55).required(),
                })
            )
            .min(1)
            .max(3),
        availability: yup
            .array()
            .of(
                yup.object().shape({
                    day: yup.number().min(1).max(7).required(),
                    start: yup.number().min(0).max(2400).required(),
                    end: yup
                        .number()
                        .moreThan(yup.ref("start"), () => {
                            return `Must be greater than start time`;
                        })
                        .max(2400)
                        .required(),
                })
            )
            .min(1),
    });
};

export { schema, validations };
