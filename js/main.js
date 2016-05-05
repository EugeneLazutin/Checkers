requirejs.config({
    baseUrl: 'js/checkers',
    paths: {
        'angular': '../plugins/angular',
        'jquery': '../plugins/jquery',
        'app': 'app'
    },
    shim: {
        'jquery': {
            exports: 'jquery'      
        },
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        },
        'app': {
            deps: ['angular']  
        }
    }
});

require(['app']);