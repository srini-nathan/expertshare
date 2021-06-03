import * as yup from "yup";

const schema = yup.object().shape({
    isVisible: yup.boolean(),
});

export { schema };
