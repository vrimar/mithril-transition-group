module.exports = {
  diff: true,
  colors: true,
  extension: ['ts'],
  require: [
    'ts-node/register', './test/setup.js'
  ],
  'watch-files': ['./test/**/*.spec.ts'],
};
