module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            build: {
                options: {
                    mangle: true,
                    exportAll: false,
                    beautify: false
                },
                files: {
                    'build/static/js/build.min.js': ['build/static/js/lib/jquery-2.1.4.js', 'build/static/js/**/*.js']
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'build/index.html': ['build/index.html']
                }
            }
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'build/index.html': 'build/index.html'
                }
            },
        },
        shell: {
            options: {
                stderr: false
            },
            target: {
                command: 'rm -r build/static/js/lib/ && rm -r build/static/sass/ && rm build/static/js/main.js'
            }
        },
        // DEVELOPMENT
        // sass: {
        //     dist: {
        //         files: {
        //             'static/styles/css/main.css': 'static/scss/main.scss'
        //         }
        //     }
        // },
        // watch: {
        //     files: ['dev/scss/**/*.scss'],
        //     tasks: ['sass']
        // },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', ['uglify', 'processhtml', 'htmlmin', 'shell']);
    grunt.registerTask('default', ['build']);
};
