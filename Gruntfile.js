module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),
        concat: {
            target: {
                src: ['./src/lib/require.js','./build/main-built.js'],
                dest: 'js/build/min.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    global_defs: {
                        "DEBUG": true
                    }
                }
            },
            target: {
                files: {
                    './build/min.js': ['./src/lib/require.js','./build/main-built.js']        
                }
            }
        },
        requirejs: {
            compile1: {
                options: {
                    baseUrl: './src/',
                    name: "main",
                    out: "./build/main-built.js"
                }
            },
            compile2: {
                options: {
                    baseUrl: './src/',
                    name: "main",
                    out: "./build/main-hi.js"
                }
            }            
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('debug', ['requirejs', 'uglify']);
    grunt.registerTask('deploy', ['requirejs', 'uglify']);

};