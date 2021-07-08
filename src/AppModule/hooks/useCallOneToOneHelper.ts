import { useRecoilState } from "recoil";
import { appCallOneToOne, AppCallOneToOneType } from "../atoms";

type CallOneToOneHelperType = {
    set: (call: AppCallOneToOneType | null) => void;
    call: AppCallOneToOneType | null;
};

export function useCallOneToOneHelper(): CallOneToOneHelperType {
    const [value, setValue] = useRecoilState(appCallOneToOne);
    const set = (call: AppCallOneToOneType | null): void => {
        setValue(call);
    };

    return {
        set,
        call: value,
    };
}
