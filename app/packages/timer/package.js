Package.describe({
    name: 'leshik:timer',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Countdown timer',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('reactive-var');
    api.use('reactive-dict');
    api.addFiles('timer.js');
    api.export('Timer');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('reactive-var');
    api.use('reactive-dict');
    api.use('tinytest');
    api.use('leshik:timer');
    api.addFiles('timer-tests-client.js', 'client');
});
