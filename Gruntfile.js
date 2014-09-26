

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
    less: {
      dev: {
        options: {
          paths: ["."]
        },
        files: _.object(mycssfiles, lessfiles),
      }
    },
    watch: {
      less: {
        files: "src/css/**.less",
        tasks: ['less']
      },
      cssmin: {
        files: cssfiles,
        tasks: ['cssmin'],
      },
      js: {
        files: jsfiles,
        tasks: ['uglify'],
      },
    },
    cssmin: {
      dist: {
        files: {
          'static/css/style.min.css': cssfiles,
        }
      },
    },
    clean: {
      tmp: {
        src: ['tmp.js'],
      }
    },
    uglify: {
      dev: {

      },
      dist: {
        files: {
          'static/all.js': jsfiles,
        }
      },
    },
    "file-creator": {
      dev: {
        files: [{
          file: "tmp.js",
          method: function(fs, fd, done) {
            fs.writeSync(fd, "head.load.apply(head, " + JSON.stringify(jsfiles) + ");\n"
              + "window['$'] = head.ready;");
            done();
          }
        }],
      }
    },
    concat: {
      dev: {
        src: ['bower_components/headjs/dist/1.0.0/head.js', 'tmp.js'],
        dest: 'static/all.js',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-file-creator');

  grunt.registerTask('dev', ['less', 'cssmin', 'file-creator:dev', "concat:dev", "clean:tmp"]);
  grunt.registerTask('dist', ['less', 'cssmin', 'uglify']);
  grunt.registerTask('watcher', ['dev', 'watch']);

  grunt.registerTask('default', ['dev']);

};