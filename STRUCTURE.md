# PROJECT STRUCTURE

-   Project directory structure will be divide based upon modules, so each module will be in a seperate directory under `src`, let's have an example, we have "**Events**", then path for that module will be `src\events`

```
public
src

  +-- ModuleName
    +-- components                  [ components root directory
      +-- ComponentName             [ component top level directory
        +-- index.ts                [ directory level exports
        +-- ComponentName.ts        [ contain logic
        +-- style.scss              [ style related to the component
        +-- assets                  [ any assets related to the component
          +-- images                [ images related to the component only
          +-- fonts                 [ fonts related to the component only
          +-- etc                   [ create any number of folders to create a group for related assets
    +-- containers                  [ containers root directory
      +-- ContainerName             [ container top level directory
        +-- index.ts                [ directory level exports
        +-- ContainerName.ts        [ contain logic
        +-- style.scss              [ style related to the component
    +-- pages                       [ pages root directory
      +-- page-name                 [ page directory
        +-- index.ts                [ directory level exports
        +-- style.scss              [ style related to the page
        +-- page-name.ts            [ contain logic
          +-- assets                [ any assets related to the page
            +-- images              [ images related to the page only
            +-- fonts               [ fonts related to the page only
            +-- etc                 [ create any number of folders to create a group for related assets
    +--
```

## Rules

1. Module directory should be in `PascalCase`
2. Module directory name suffixed with `Module` word, so "chat" module dir name should be `ChatModule`
3. Component/Container directory and file name should be `PascalCase`, for e.g. "input box" component dir name should be <code>AppInputBox</code> and file name should be <code>AppInputBox.tsx</code>
4. Component/Container name should be start with "App" prefix, to disguise, and prevent conflict between Custom and Third-Party Components.
5. Page directory and file name should be `PascalCase`, for e.g. "homepage" page dir name should be <code>HomePage</code> and file name should be <code>HomePage.tsx</code>
6. Page name should be ended with "page" postfix.

## Type of components

-   ### **Component**
    1. It contains static UI
    2. Should not have any API call
    3. Should not have any binding to state ( Context/Recoil )
    4. Let's take `AppInputBox`, `AppButton`, `AppList` and `AppListItem`

-   ### **Container**
    1. It is a group of related component
    2. Might have APIs call
    3. Might have binding to state ( Context/Recoil )
    4. Let's take `AppComments` and `AppComposeComment`, the `AppComments` will use `AppList` and `AppListItem` underneath with binding an api call to fetch comments, and the `ComposeComment` will use `InputBox` and `Button` to render a comment post UI, that also have API call to post new comment

-   ### **Page**
    1. It is one kind of container, that can be render at specific path or url
    2. Might have APIs call
    3. Might have binding to state ( Context/Recoil )
    4. Let's take `Live Session` page as example that will render at url "`/live-session`",this page will have comment list with container `AppComments` and post a comment using `AppComposeComponent`
