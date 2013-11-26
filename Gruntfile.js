'use strict';

module.exports = function (grunt) {

	
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
	
    // configurable paths
    var yeomanConfig = {
		temp: '.tmp',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					nodeArgs: ['--debug'],
					env: {
						PORT: '8282'
					}
				}
			}
		},
		less: {
			development: {
				files: {
					"css/style.css": "styles/style.less"
				}
			}
		},
        watch: {
			less : {
				files: "styles/*",
				tasks: ["less"]
			}
		}
    });
	
    grunt.registerTask('server', function (target) {
		var nodemon = grunt.util.spawn({
			cmd: 'grunt',
			grunt:true,
			args: 'nodemon'
		});
		nodemon.stdout.pipe(process.stdout);
		nodemon.stderr.pipe(process.stderr);
		
        return grunt.task.run([
			'watch'
		]);
    });
};
