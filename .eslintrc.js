module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['custom'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    "jsx-a11y/alt-text": "off",
    "react/no-unescaped-entities": "off"
  },
};
