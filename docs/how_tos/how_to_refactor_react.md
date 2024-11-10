**TurboRepo** is a powerful tool that we use to manage our monorepo and share components across different parts of our application. It helps us to maintain consistency, reduce code duplication, and improve the overall efficiency of our development process. 🚀

For instance, consider the `GoogleAddressInput` component. This component is shared and can be used in different parts of our application.

1. **In an app:** When we want to use this component in an app, like in `apps/bastion/src/app/orgs/[id]/page.tsx`, we import it from the `ui` package. This is done using the following import statement:

    ```typescript
    import { GoogleAddressInput } from 'ui';
    ```
    This statement tells our application to look for the `GoogleAddressInput` component in the `ui` package. 

2. **In a shared package:** When we want to use this component within the same shared package, we import it directly from its file. This is done using the following import statement:

    ```typescript
    import { GoogleAddressInput } from './google-address-input';
    ```
    This statement tells our application to look for the `GoogleAddressInput` component in the same directory as the current file.

By using TurboRepo, we can easily manage and share components like `GoogleAddressInput` across our application, making our code more maintainable and our development process more efficient. 🎉👏