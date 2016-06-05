module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            sass: {
                files: ['Gruntfile.js', 'public/styles/sass/**/*.scss'],
                tasks: ['sass', 'cssmin']
            }
        },
        sass: {
            dist: {
                files: {
                    'public/styles/main.css': 'public/styles/sass/main.scss'
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/styles/',
                    src: ['main.css'],
                    dest: 'public/',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('minify', ['sass', 'cssmin']);
};
