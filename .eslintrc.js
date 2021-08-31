module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'standard',
  ],
  plugins: ['import', 'node', 'jest'],
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  rules: {
    "semi": 0,
    "accessor-pairs": 0,
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      env: {
        'jest/globals': true,
      },
    },
  ],
};