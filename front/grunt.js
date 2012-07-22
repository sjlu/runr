module.exports = function(grunt) {
  grunt.initConfig({
    min: {
      dist: {
        src: ['assets/js/custom.js', 'assets/js/custom.*.js'],
        dest: 'assets/js/custom.min.js'
      }
    },
    uglify: {
      mangle: {toplevel: true},
      squeeze: {dead_code: false},
      codegen: {quote_keys: true}
    }
  });

  grunt.registerTask('default', 'min');
};