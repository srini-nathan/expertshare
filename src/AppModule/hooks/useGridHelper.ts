type GridHelperType = {
    getColumnClasses: (
        xs?: string | number,
        sm?: string | number,
        md?: string | number,
        lg?: string | number,
        xl?: string | number
    ) => string;
};

export function useGridHelper(): GridHelperType {
    const getColumnClasses = (
        xs?: string | number,
        sm?: string | number,
        md?: string | number,
        lg?: string | number,
        xl?: string | number
    ): string => {
        let classesName = ``;

        if (xs) {
            classesName += `col-xs-${xs} `;
        }

        if (sm) {
            classesName += `col-sm-${sm} `;
        }

        if (md) {
            classesName += `col-md-${md} `;
        }

        if (lg) {
            classesName += `col-lg-${lg} `;
        }

        if (xl) {
            classesName += `col-xl-${xl} `;
        }

        return classesName;
    };

    return {
        getColumnClasses,
    };
}
