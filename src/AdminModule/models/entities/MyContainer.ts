import { Language } from "./Language";
import { Container } from "./Container";

export class MyContainer extends Container {
    languages?: Language[];

    constructor(
        client: string,
        { languages, ...rest }: Partial<MyContainer> = {}
    ) {
        super(client, rest);
        this.languages = languages;
    }
}
