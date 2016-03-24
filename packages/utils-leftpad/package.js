Package.describe({
  name: 'leshik:utils-leftpad',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Left pads a primitive of type string or number with a given number of "padders".',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('utils-leftpad.js');
  api.export('leftPad');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('leshik:utils-leftpad');
  api.addFiles('utils-leftpad-tests-client.js', 'client');
  api.addFiles('utils-leftpad-tests-server.js', 'server');
});
