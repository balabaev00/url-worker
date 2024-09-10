module.exports = {
  extends: '@r1-backend/eslint-config',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
};
