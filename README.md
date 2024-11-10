[![(DEV) Deploy to Google Cloud Run](https://github.com/colorfull-ai/colorfull/actions/workflows/dev_deploy.yaml/badge.svg)](https://github.com/colorfull-ai/colorfull/actions/workflows/dev_deploy.yaml)
[![(PROD) Deploy to Google Cloud Run](https://github.com/colorfull-ai/colorfull/actions/workflows/prod_deploy.yaml/badge.svg)](https://github.com/colorfull-ai/colorfull/actions/workflows/prod_deploy.yaml)

# Getting Started with Our Project

Welcome to our project! This guide will walk you through setting up your environment, understanding the project structure, and getting started with development. Let's dive in!

## Prerequisites

Before you begin, ensure you have the following installed:

- **node**: If you don't have Node installed, head [here](https://nodejs.org/en/download).
- **pnpm**: We use `pnpm` for managing our packages. If you don't have `pnpm` installed, follow the instructions [here](https://pnpm.io/installation).
- **turbo**: Our project relies on `turbo` for various tasks. You can run `pnpm install turbo --global` or install it following the [official documentation](https://turborepo.org/docs).
- **python**: Download Python version 3.10.6 [here](https://www.python.org/downloads/release/python-3106/).

## Initial Setup

1. **Clone the Repository**: Start by cloning the repository to your local machine. If you don't have an SSH key set up, you will need to do so by generating a new key-pair and adding that to your GitHub.
2. **Install Dependencies**:

   - Run `pnpm install` at the root of the git repository. This command will install all the necessary packages.

## Project Structure Overview

Our project is structured into several key areas:

- **UI Applications**:

  - **Vanguard**: Our main consumer-facing application. Start it with `./start_vanguard.sh`.
  - **Bastion**: Our admin application. Start it with `./start_bastion.sh`.
  - **Workshop**: For visual UI component documentation using Storybook. Start it with `./start_workshop.sh`.
- **Shared Packages**:

  - **UI Package**: Contains database models, clients, shared components, and base components. These are exported from `index.tsx` for use in the frontend.
- **Backend**:

  - A FastAPI server deployed on Cloud Run.
  - Event system using Google Cloud Tasks for asynchronous callbacks.

## Development Workflow

1. **Starting the Applications**:

   - For **Vanguard**, run `./start_vanguard.sh`.
   - For **Bastion**, run `./start_bastion.sh`.
   - For **Workshop**, run `./start_workshop.sh`.
2. **Building for Deployment**:

   - Ensure there are no errors before deployment by running `./build_bastion.sh` and `./build_vanguard.sh`. These scripts build the applications as they would be built on Vercel.
3. **Deployments**:

   - The **backend** is deployed to Cloud Run via GitHub Actions.
   - **Vanguard** and **Bastion** are deployed on Vercel.

   Bastion can be accessed at [colorfull-bastion.vercel.app/orgs](https://colorfull-bastion.vercel.app/orgs), and Vanguard at [colorfull-vanguard.vercel.app](https://colorfull-vanguard.vercel.app/).

## Contributing

We welcome contributions! Please read our contribution guidelines (link to your contribution guidelines) for more information on how to contribute.

## Support

If you need help or have any questions, feel free to open an issue on our GitHub repository or contact us directly.
# notion-book
