module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),
        concat: {
            debug: {
                src: ['./src/lib/leap.js', './src/lib/require.js','./build/main.debug.js'],
                // dest: './build/main.debug.js'
                dest: './extension/content.js'
            }
        },
        uglify: {
            deploy: {
                files: {
                    './build/main.deploy.js': ['./src/lib/leap.js', './src/lib/require.js','./build/main.min.js']        
                }
            }
        },
        requirejs: {
            debug: {
                options: {
                    baseUrl: './src/',
                    name: "main",
                    out: "./build/main.debug.js",
                    uglify: {
                        beautify: true,
                        no_mangle: true
                    }
                }
            },
            deploy: {
                options: {
                    baseUrl: './src/',
                    name: "main",
                    out: "./build/main.min.js"
                }
            }            
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('debug', ['requirejs:debug', 'concat:debug']);
    grunt.registerTask('deploy', ['requirejs:deploy', 'uglify:deploy']);

};