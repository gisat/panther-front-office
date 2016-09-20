var allTestFiles = [];
var TEST_REGEXP = /(Spec|Test)\.js$/i;
var ThemeYearConfParams = {
    dataset: 2,
    theme: 3,
    years: [4]
};

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    paths: {
        'css': 'src/__new/lib/css.min',
        'jquery': 'src/__new/lib/jquery-3.0.0',
        'jquery-private': 'src/__new/js/jquery-private',
        'jquery-touch': 'src/__new/lib/jquery-ui.touch-punch.min',
        'jquery-ui': 'src/__new/lib/jquery-ui.min',
        'string': 'src/__new/lib/string',
        'underscore': 'src/__new/lib/underscore-min',
        'text': 'src/__new/lib/text'
    },

    map: {
        // '*' means all modules will get 'jquery-private' for their 'jquery' dependency.
        '*': {
            'css': 'css',
            'jquery': 'jquery-private'
        },

        // 'jquery-private' wants the real jQuery module though. If this line was not here, there would be an unresolvable cyclic dependency.
        'jquery-private': {
            'jquery': 'jquery'
        }
    },

    shim: {
        'jquery-touch': ['jquery','jquery-ui'],
        'jquery-ui': ['jquery'],
        'underscore': {
            exports: '_'
        }
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});