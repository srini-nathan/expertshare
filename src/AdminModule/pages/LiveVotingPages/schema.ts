import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.string().required(),
    type: yup.string().required(),
    chartType: yup.string().required(),
});

export { schema };
