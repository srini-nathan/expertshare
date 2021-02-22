import React from "react";
import BootstrapProvider from "@bootstrap-styled/provider";
import defaultTheme from "../src/SharedModule/theme/expertshare";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [(Story) => <BootstrapProvider theme={defaultTheme}>{Story()}</BootstrapProvider>]
