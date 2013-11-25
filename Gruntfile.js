'use strict';

module.exports = function (grunt) {

	
	grunt.loadNpmTasks('grunt-nodemon');
	
    // configurable paths
    var yeomanConfig = {
        app: 'app',
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
		}
    });
	
    grunt.registerTask('server', function (target) {
        return grunt.task.run([
			'nodemon'
		]);
    });
};
