
module.exports = function(grunt) {

  var port = 8585;

  grunt.initConfig({
    'http-server':{
      dev:{
        root:'.',
        port:port,
        host:'0.0.0.0',
        runInBackground:true
      }
    },
    sass: {
      dist: {
        files: {
          'test/css/rj3d.css': 'test/sass/rj3d.scss'
        }
      }
    },
    pug: {
      compile: {
        options: {
          pretty:true,
          data: {
            debug: false
          }
        },
        files: {
          'test/base.html': ['test/pug/base.pug'],
          'test/index.html': ['test/pug/base.pug'],
          'production/index.html': ['test/pug/base-production.pug']
        }
      }
    },
    watch:{
      sass:{
        files:'test/sass/**/*.scss',
        tasks:['sass']
      },
      pug:{
        files:'test/pug/**/*.pug',
        tasks:['pug']
      },
      ctags:{
        files:'src/**/*.js',
        tasks:['exec:ctags']
      }
    },
    exec:{
      ctags:{
        cmd:'exctags -R src/'
      }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      dist: {
        files: {
          'dist/css/rj3d.prod.min.css': ['test/css/rj3d.prod.css']
        }
      }
    },
    concat:{
      dist:{
        src:['test/css/app.css', 'test/css/rj3d.css', 'test/css/site.css'],
        dest:'test/css/rj3d.prod.css'
      },
    },
    clean:{
      dist:['dist/*.js', 'dist/*.css', 'dist/css/*.css'],
      production:['production/assets', 'production/css', 'production/js/*.js'],
      requirejs:['test/js/rj3d.js']
    },
    copy:{
      'dist-css':{
        expand:true,
        cwd:'test/css',
        src:['*.png', '*.svg', 'fonts/**', 'rj3d-iframe.css'],
        dest:'dist/css/'
      },
      'dist-js':{
        expand:true,
        cwd:'test/js',
        src:['anime.min.js', 'three.min.js', 'partykals.min.js', 'GLTFLoader.min.js', 'SkeletonUtils.min.js'],
        dest:'dist'
      },
      'production-html':{
        expand:true,
        cwd:'test',
        src:['index.html'],
        dest:'production/'
      },
      'production-js':{
        expand:true,
        cwd:'dist',
        src:['*.js'],
        dest:'production/js/'
      },
      'production-css':{
        expand:true,
        cwd:'dist',
        src:['css/**'],
        dest:'production/'
      },
      'production-assets':{
        expand:true,
        cwd:'test',
        src:['assets/**', 'config.json', 'data/**'],
        dest:'production/'
      }
    },
    'requirejs':{
      compile:{
        options:{
          baseUrl: "src/",
          paths: {
            'libs': "../libs"
          },
          wrap:{
            startFile:'libs/start.frag',
            endFile:'libs/end.frag'
          },
          optimize:'none', 
          name:'libs/almond',
          include:['rs/rj3d/RobotJump'],
          out:'test/js/rj3d.js'
        }
      }
    },
    uglify:{
      dist:{
        files:{
          'dist/rj3d.min.js':['test/js/rj3d.js']
        }
      }
    },
    compress: {
      dist: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'dist/',
        src: ['rj3d.min.js'],
        dest: 'dist/',
        ext:'.min.gz.js'
      }
    },
    jshint:{
      check:{
        src:'src/rs/**'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-exec');

  // Generate distribution files
  grunt.registerTask('dist', 'Create distributions', 
    ['clean:dist', 
    'sass', 
    'concat:dist', 
    'cssmin:dist', 
    'copy:dist-css', 
    'copy:dist-js', 
    'requirejs',
    'uglify',
    'clean:requirejs',
    'compress:dist']);

  // Generate production templates
  grunt.registerTask('production', 'Create production', 
    ['clean:production', 
    'dist', 
    'pug', 
    'copy:production-css', 
    'copy:production-js', 
    'copy:production-assets']);

  grunt.registerTask('default', ['http-server', 'watch']);
}

