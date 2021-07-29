import * as Yup from "yup";

const schema = Yup.object().shape({
    name: Yup.string().required(),
    translations: Yup.array().of(
        Yup.object().shape({
            title: Yup.string().required(),
            locale: Yup.string().required(),
        })
    ),
    type: Yup.string().required(),
    chartType: Yup.string().required(),
    voteOptions: Yup.array().of(
        Yup.object().shape({
            translations: Yup.array().of(
                Yup.object().shape({
                    title: Yup.string().required(),
                    description: Yup.string().required(),
                    locale: Yup.string().required(),
                })
            ),
        })
    ),
});

export { schema };
