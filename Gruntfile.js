module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // minimize svgs
    svgmin: {
      options: {
        plugins: [
          { removeViewBox: false }, 
          { removeUselessStrokeAndFill: false}, 
          // {
            // removeAttrs: {
            //   attrs: ['xmlns'] // need this for background images
            // }
          // }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: "dist/assets/svg/",
            src: ['**/*.svg'],
            dest: 'dist/assets/svg-min/',
            ext: '.svg'
          }
        ]
      }
    },

    // compile sass
    sass: {
      options: {
        style: 'expanded'
        // lineNumbers: true
      },
      dist: {
        files: {
          'dev/assets/css/app.noprefix.css': 'dev/assets/sass/app.sass', // 'destination': 'source'
        }
      }
    },

    postcss: {
        options: {
            map: false,
            processors: [
                require('autoprefixer')({
                    browsers: ['last 2 versions']
                })
            ]
        },
        app: {
            src: 'dev/assets/css/app.noprefix.css',
            dest: 'dist/assets/css/app.css'
        }
    },

    // copy assets
    copy: {
      js_to_frontend: {
        cwd: 'dev/assets/js',
        src: '**',
        expand: true,
        dest: 'dist/assets/js',
        flatten: false
      }
    },

    // compile handlebars
    'compile-handlebars': {
      globbedTemplateAndOutput: {
        template: 'dev/templates/*.html',
        templateData: 'dev/templates/**/**/*.json',
        output: 'dist/*.html',
        partials: 'dev/templates/partials/**/*.html'
      }
    },

    express: {
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },

    // watch
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['dev/assets/sass/**/*', 'dev/templates/**/*'],
        tasks: ['svgmin', 'sass', 'postcss', 'copy:js_to_frontend', 'compile-handlebars']
      },
      js: {
        files: ['dev/assets/js/**/*'],
        tasks: ['copy:js_to_frontend']
      }
    },

    // configure live reload
    livereload: {
      options: {
        base: ''
      },
      files: ['dist/**/*']
    }
  });

  require('matchdep').filterDev(['grunt-*', 'postcss']).forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['svgmin', 'copy', 'sass', 'compile-handlebars', 'postcss', 'watch', 'livereload']);
};
