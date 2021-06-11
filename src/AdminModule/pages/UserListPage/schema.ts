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
        firstName: yup
            .string()
            .min(validations.firstName.min)
            .required("First Name is Reqired"),
        lastName: yup
            .string()
            .min(validations.lastName.min)
            .required("Last Name is Reqired"),
        company: yup
            .string()
            .min(validations.company.min)
            .required("Company is Reqired"),
        jobTitle: yup
            .string()
            .min(validations.jobTitle.min)
            .required("Job Titile is Reqired"),
        email: yup.string().email().required(),
        locale: yup.string().required("Locale is Reqired"),
        role: yup.string().required("Role is Reqired"),
        relationManager: yup.string(),
        timezone: yup.string().required("Timezone is Reqired"),
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
