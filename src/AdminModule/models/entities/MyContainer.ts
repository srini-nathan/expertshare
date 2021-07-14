import { Language } from "./Language";
import { Container } from "./Container";
import { Navigation } from "./Navigation";

export class MyContainer extends Container {
    languages?: Language[];

    navigation?: Navigation[];

    constructor(
        client: string,
        { languages, navigation, ...rest }: Partial<MyContainer> = {}
    ) {
        super(client, rest);
        this.languages = languages;
        this.navigation = navigation;
    }
}
