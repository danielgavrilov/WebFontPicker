module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        filename: 'WFP',

        paths: {
            src: [
                'src/Setup.js',
                'src/Helpers.js',            
                'src/Templates.js',
                'src/Modules/*.js',
                'src/Models/*.js',
                'src/Collections/*.js',
                'src/Views/*.js',
                'src/Views/**/*.js',
                'src/Initialize.js'
            ],
            vendor: [
                'vendor/jquery-2.0.3.js',
                'vendor/jquery.animate-colors.js',
                'vendor/underscore.js',
                'vendor/backbone.js'
            ],
            sass: ['sass/main.scss'],
            templates: ['src/Templates/*.tmpl']
        },

        jst: {
            compile: {
                options: {
                    namespace: 'WFP.Templates',
                    templateSettings: {
                        variable: 'obj'
                    },
                    processName: function(filename) {
                        filename = filename.split('/');
                        return filename[filename.length - 1].split('.')[0];
                    },
                    prettify: true
                },
                files: {
                    'src/Templates.js': ['<%= paths.templates %>']
                }
            }
        },

        uglify: {

            // Does not include dependencies.
            // Only used for development.
            dev: {
                options: {
                    preserveComments: 'all',
                    mangle: false,
                    compress: false,
                    sourceMap: 'build/<%= filename %>.map',
                    sourceMapRoot: '../',
                    sourceMappingURL: 'WFP.map',
                },
                files: {
                    'build/<%= filename %>.js': ['<%= paths.src %>'],
                }
            },

            // Contains all dependencies.
            full: {
                options: {
                    preserveComments: 'some',
                    mangle: true,
                    compress: true,
                    banner: [
                        '/*!',
                        ' * <%= pkg.name %> <%= pkg.version %>',
                        ' * Last updated: <%= grunt.template.today("yyyy-mm-dd") %>',
                        ' * ',
                        ' * (c) 2013 Daniel Gavrilov',
                        ' * MIT License',
                        ' */',
                        '',
                        '(function(window, document, $, _, Backbone, undefined) {',
                        '\n'
                    ].join('\n'),
                    footer: '\n})(window, document, jQuery.noConflict(true), _.noConflict(), Backbone.noConflict());'
                },
                files: {
                    'build/<%= filename %>.full.min.js': ['<%= paths.vendor %>', 'build/<%= filename %>.js'],
                }
            }
        },

        /* Fix: sass compiles to an empty file */
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'build/<%= filename %>.css': ['<%= paths.sass %>']
                }
            }
        },

        watch: {
            all: {
                files: ['Gruntfile.js', '<%= paths.src %>'],
                tasks: ['uglify:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jst', 'uglify:dev']);
    grunt.registerTask('release', ['jst', 'uglify:dev', 'uglify:full']);
};