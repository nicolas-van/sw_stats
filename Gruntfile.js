

module.exports = function(grunt) {

  var _ = require("underscore");

  var libjsfiles = [
    "bower_components/underscore/underscore.js",
    "bower_components/jquery/jquery.js",
    "bower_components/bootstrap/dist/js/bootstrap.js",
  ];
  var myjsfiles = [
    "src/js/app.js",
  ];
  var jsfiles = [].concat(libjsfiles).concat(myjsfiles);

  var libcssfiles = [
  ];
  var lessfiles = [
    "src/css/style.less",
  ];
  var mycssfiles = _.map(lessfiles, function(e) { return e.replace(".less", ".css") });
  var cssfiles = [].concat(libcssfiles).concat(mycssfiles);

  grunt.initConfig({
    // always used
    less: {
      dev: {
        options: {
          paths: ["."]
        },
        files: _.object(mycssfiles, lessfiles),
      }
    },
    clean: {
      tmp: {
        src: ['tmp.js'],
      }
    },

    // for dev
    jshint: {
      files: myjsfiles,
      options: {
        sub: true,
        eqeqeq: true, // no == or !=
        immed: true, // forces () around directly called functions
        forin: true, // makes it harder to use for in
        latedef: "nofunc", // makes it impossible to use a variable before it is declared
        newcap: true, // force capitalized constructors
        strict: true, // enforce strict mode
        trailing: true, // trailing whitespaces are ugly
        camelcase: true, // force camelCase
      },
    },
    "file-creator": {
      dev_tmpjs: {
        files: [{
          file: "tmp.js",
          method: function(fs, fd, done) {
            fs.writeSync(fd, "window['$'] = head.ready;\n" +
              "head.load.apply(head, " + JSON.stringify(cssfiles.concat(jsfiles)) + ");\n");
            done();
          }
        }],
      },
      dev_css: {
        files: [{
          file: "static/style.css",
          method: function(fs, fd, done) {
            fs.writeSync(fd, "");
            done();
          }
        }],
      },
    },
    concat: {
      dev: {
        src: ['bower_components/headjs/dist/1.0.0/head.load.js', 'tmp.js'],
        dest: 'static/all.js',
      },
    },
    watch: {
      less: {
        files: "src/css/**.less",
        tasks: ['less']
      },
    },

    // for dist
    cssmin: {
      dist: {
        files: {
          'static/style.css': cssfiles,
        }
      },
    },
    uglify: {
      dist: {
        files: {
          'static/all.js': jsfiles,
        }
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-file-creator');

  grunt.registerTask('dev', ['jshint', 'less', 'file-creator', "concat:dev", "clean:tmp"]);
  grunt.registerTask('dist', ['less', 'cssmin', 'uglify']);
  grunt.registerTask('watcher', ['dev', 'watch']);

  grunt.registerTask('default', ['dev']);

};