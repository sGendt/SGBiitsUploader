// module.exports = function(grunt) {
//
//     // Project configuration.
//     grunt.initConfig({
//         pkg: grunt.file.readJSON('package.json'),
//         uglify: {
//             options: {
//                 banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//             },
//             build: {
//                 src: 'index.js',
//                 dest: 'build/<%= pkg.name %>.min.js'
//             }
//         },
//         transpile: {
//             main: {
//                 type: "globals", // or "amd" or "yui"
//                 files: [{
//                     expand: true,
//                     cwd: 'lib/',
//                     src: ['**/*.js'],
//                     dest: 'tmp/'
//                 }]
//             }
//         }
//     });
//
//     // Load the plugin that provides the "uglify" task.
//     grunt.loadNpmTasks('grunt-contrib-uglify');
//     //
//     grunt.loadNpmTasks('grunt-es6-module-transpiler');
//
//     // Default task(s).
//     grunt.registerTask('default', ['uglify']);
//     grunt.registerTask('build', ['uglify', 'transpile']);
//
// };

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                "sourceMap": true
            },
            dist: {
                files:
                    [{
                    "expand": true,
                    "src": "index.js",
                    "dest": "build/",
                    "ext": ".js"
                }]
            }
        },
        uglify: {
            all_src : {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                src: 'build/index.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask("default", ["babel", "uglify"]);
};