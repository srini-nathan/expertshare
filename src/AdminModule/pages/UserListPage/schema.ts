import * as yup from "yup";

const validations = {
    firstName: {
        min: 2,
    },
    lastName: {
        min: 2,
    },
    company: {
        min: 2,
    },
    jobTitle: {
        min: 2,
    },
    plainPassword: {
        min: 6,
    },
};

const schema = (isEditMode: boolean) => {
    let validationShape = {
        firstName: yup.string().nullable(),
        lastName: yup.string().nullable(),
        company: yup.string().nullable(),
        jobTitle: yup.string().nullable(),
        email: yup.string().email().required(),
        locale: yup.string().nullable(),

        role: yup.string().required("Role is Reqired"),
        relationManager: yup.string(),
        timezone: yup.string().nullable(),
        isBlocked: yup.boolean(),
    };
    const authValidationShape = {
        plainPassword: yup.string().required(),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("plainPassword"), null], "Passwords must be match"),
    };

    if (!isEditMode) {
        validationShape = {
            ...validationShape,
            ...authValidationShape,
        };
    }

    return yup.object().shape(validationShape);
};

export { schema, validations };
