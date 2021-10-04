import * as yup from "yup";

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
                    end: yup.number().min(0).max(2400).required(),
                })
            )
            .min(1)
            .max(3),
    });
};

export { schema, validations };
