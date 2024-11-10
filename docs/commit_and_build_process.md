# Commit and Build Process

This document explains the commit and build process in our project, which is managed by two main configuration files: `lefthook.yml` and `biome.json`.

## lefthook.yml

Lefthook is a fast and powerful Git hooks manager for any type of projects. The `lefthook.yml` file is a configuration file for Lefthook.

In this file, you define actions that should be performed before certain Git operations, such as commit (pre-commit) or push (pre-push). These actions are known as Git hooks.

Here's a breakdown of the hooks in your `lefthook.yml`:

- `pre-push`: This hook is run before your changes are pushed to the remote repository. Currently, this section is commented out in your configuration.

- `pre-commit`: This hook is run before your changes are committed. It runs several commands in parallel:
  - `frontend-check`: Checks frontend files and applies fixes. It uses Biome to check the files and apply fixes if necessary.
  - `apps-build`: Builds all apps that have changes in the current commit. It uses Turbo to build the apps.

## biome.json

Biome is a tool for managing JavaScript and TypeScript projects. The `biome.json` file is a configuration file for Biome.

In this file, you define settings for organizing imports, linting, and formatting your code.

Here's a breakdown of the settings in your `biome.json`:

- `organizeImports`: Controls whether Biome should organize your imports. It's enabled in your configuration.

- `linter`: Controls the linter settings. It's enabled in your configuration, and several rules are defined for different categories like recommended, complexity, suspicious, and correctness.

- `formatter`: Controls the formatter settings. It's enabled in your configuration, and several file patterns are ignored.

- `javascript`: Contains settings specific to JavaScript files. In your configuration, it defines the quote style for JavaScript and JSX.

These files help maintain code quality and consistency in your project by automatically checking, formatting, and building your code.