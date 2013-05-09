module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: [
        "build/fixtures"
      ]
    },

    typescript: {
      base: {
        src: ['fixtures/**/*.ts'],
        dest: 'src',
        options: {
          module: 'commonjs', //or commonjs
          target: 'es5', //or es3
          sourcemap: true,
          base_path: 'fixtures',
          fullSourceMapPath: true,
          declaration: true,
          comments: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean:build', 'typescript']);

};