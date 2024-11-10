// module.exports = {
//   extends: [require.resolve('config/eslint/base.js')],
//   parserOptions: {
//     tsconfigRootDir: __dirname,
//     project: './tsconfig.json'
//   },
// };

module.exports = {
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    "jsx-a11y/alt-text": "off"

  },
};
