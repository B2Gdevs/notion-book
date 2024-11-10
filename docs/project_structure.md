This is colorfull

This is the current project structure as of Dec 11th, 2023

```bash
colorfull
├── apps
│   ├── bastion
│   │   ├── public
│   │   └── src
│   │       ├── app
│   │       │   ├── areas
│   │       │   │   └── [areaId]
│   │       │   ├── components
│   │       │   ├── engineering
│   │       │   │   ├── environments
│   │       │   │   │   └── [env_id]
│   │       │   │   │       └── features
│   │       │   │   │           └── [feature_id]
│   │       │   │   └── webhooks
│   │       │   ├── orgs
│   │       │   │   └── [id]
│   │       │   │       └── stores
│   │       │   │           └── [storeId]
│   │       │   │               └── menus
│   │       │   │                   └── [menuId]
│   │       │   │                       ├── categories
│   │       │   │                       │   └── [categoryId]
│   │       │   │                       ├── items
│   │       │   │                       │   └── [itemId]
│   │       │   │                       ├── modifier-groups
│   │       │   │                       │   └── [groupId]
│   │       │   │                       └── photos
│   │       │   │                           └── [photoId]
│   │       │   ├── payments
│   │       │   ├── return
│   │       │   └── users
│   │       │       └── [id]
│   │       │           └── orders
│   │       ├── constants
│   │       ├── hooks
│   │       └── providers
│   ├── vangaurd
│   │   ├── public
│   │   └── src
│   │       ├── app
│   │       │   ├── accounts
│   │       │   │   └── [id]
│   │       │   │       ├── admin
│   │       │   │       ├── budgets
│   │       │   │       ├── employees
│   │       │   │       ├── onboarding
│   │       │   │       ├── payments
│   │       │   │       ├── reports
│   │       │   │       └── stores
│   │       │   │           └── [storeId]
│   │       │   ├── callback
│   │       │   ├── cancel
│   │       │   ├── components
│   │       │   ├── my-orders
│   │       │   ├── orgs
│   │       │   │   └── [id]
│   │       │   │       └── menus
│   │       │   ├── partners
│   │       │   ├── refresh
│   │       │   ├── return
│   │       │   └── user
│   │       │       └── [id]
│   │       │           ├── payments
│   │       │           └── settings
│   │       ├── constants
│   │       ├── providers
│   │       └── stores
│   └── workshop
│       └── public
├── colorfull
│   ├── apps
│   │   ├── area_management
│   │   │   ├── api
│   │   │   └── models
│   │   ├── cache
│   │   │   └── models
│   │   ├── dispatcher
│   │   │   └── service
│   │   ├── event_management
│   │   │   └── service
│   │   ├── feature_param
│   │   │   ├── api
│   │   │   └── models
│   │   ├── integration_management
│   │   │   ├── api
│   │   │   ├── models
│   │   │   └── service
│   │   │       └── otter
│   │   ├── mapper
│   │   │   ├── docs
│   │   │   └── service
│   │   ├── menu_management
│   │   │   ├── api
│   │   │   ├── models
│   │   │   └── service
│   │   ├── notification
│   │   │   ├── models
│   │   │   ├── service
│   │   │   └── tests
│   │   ├── order_management
│   │   │   ├── api
│   │   │   └── models
│   │   ├── org_management
│   │   │   ├── api
│   │   │   └── models
│   │   ├── store_management
│   │   │   ├── api
│   │   │   └── models
│   │   ├── user_management
│   │   │   ├── api
│   │   │   └── models
│   │   └── webhook_management
│   │       ├── api
│   │       └── models
│   ├── models
│   │   └── base_models
│   ├── service
│   │   └── initializers
│   └── tests
│       └── testdata
└── packages
    ├── config
    │   ├── eslint
    │   └── vite
    ├── tsconfig
    └── ui
        ├── assets
        │   └── fonts
        ├── src
        │   ├── clients
        │   │   ├── integrationClients
        │   │   └── menuClient
        │   ├── components
        │   │   ├── chatGPTVisualComponents
        │   │   │   └── images
        │   │   └── ui
        │   ├── constants
        │   ├── icons
        │   ├── lib
        │   └── models
        └── style
```
* tree was created with the command `tree --dirs-only -I "__pycache__|env3|node_modules"`
