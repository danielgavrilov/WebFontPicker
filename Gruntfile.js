module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        filename: 'picker',

        jsfiles: [
            'vendor/underscore.js',
            'vendor/Backbone.Events.js',
            'src/Helpers.js',
            'src/constructors/*.js',
            'src/Templates.js',
            'src/Setup.js'
        ],

        sassfiles: ['sass/picker.scss'],

        jst: {
            compile: {
                options: {
                    namespace: 'Templates',
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
                    'src/Templates.js': ['src/templates/*.template']
                }
            }
        },

        concat: {
            dist: {
                options: {
                    banner: [
                        '/*!',
                        ' * GoogleFontPicker <%= pkg.version %>',
                        ' * Last updated: <%= grunt.template.today("yyyy-mm-dd") %>',
                        ' * ',
                        ' * (c) 2013 Daniel Gavrilov',
                        ' * MIT License',
                        ' */',
                        ' ',
                        '(function(window, document) {',
                        ' ',
                        'var VERSION = "<%= pkg.version %>";',
                        '\n'
                    ].join('\n'),
                    footer: '\n})(window, document);'
                },
                src: ['<%= jsfiles %>'],
                dest: 'build/<%= filename %>.js'
            }
        },

        uglify: {
            options: {
                preserveComments: 'some',
                mangle: true,
                compress: true
            },
            dist: {
                files: {
                    'build/<%= filename %>.min.js': ['<%= concat.dist.dest %>'],
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
                    'build/<%= filename %>.css': ['<%= sassfiles %>']
                }
            },
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/<%= filename %>.css': ['<%= sassfiles %>']
                }
            }
        },

        watch: {
            all: {
                files: ['Gruntfile.js', 'src/*', 'src/**/*'],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jst','concat']); 
    grunt.registerTask('release', ['jst','concat','uglify']);
};