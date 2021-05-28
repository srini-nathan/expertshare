import * as yup from "yup";
// import { UserField } from "../../models";
// import { UserFieldApi } from "../../apis";

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

const schema = (
    isEditMode: boolean
    // fields: UserField[]
) => {
    let validationShape = {
        firstName: yup.string().min(validations.firstName.min).required(),
        lastName: yup.string().min(validations.lastName.min).required(),
        company: yup.string().min(validations.company.min).required(),
        jobTitle: yup.string().min(validations.jobTitle.min).required(),
        email: yup.string().email().required(),
        locale: yup.string().required(),
    };
    const authValidationShape = {
        plainPassword: yup.string().required(),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("plainPassword"), null], "Passwords must be match"),
    };

    // fields.forEach((e) => {
    //     if (e.isActive && e.isRequired)
    //         validationShape = {
    //             ...validationShape,
    //             [UserFieldApi.toResourceUrl(e.id)]: yup.string().required(),
    //         };
    // });

    if (!isEditMode) {
        validationShape = {
            ...validationShape,
            ...authValidationShape,
        };
    }

    return yup.object().shape(validationShape);
};

export { schema, validations };
