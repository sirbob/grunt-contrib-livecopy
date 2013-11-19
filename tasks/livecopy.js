/*
 * grunt-livecopy
 * https://github.com/sirbob/grunt-contrib-livecopy
 *
 * Copyright (c) 2013 sirbob
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var ncp = require('ncp').ncp,
        Q = require("q"),
        chokidar = require('chokidar'),
        IGNORED_FILES,
        SOURCE,
        TARGET;
    grunt.registerMultiTask('livecopy', 'Watches SOURCE directory for changes and copies them to TARGET directory. At the mo it doesn\'t watch folders.', function () {
        var done = this.async();
        var options = this.options();
        if(!options.source || !options.target){
            console.log('ERROR: Missing options. You have to provide "source" and "target"');
            done(false);
        }
        options.ignored = options.ignored || /^\./;
        runWatch(options.source, options.target, options.ignored, done);
    });

    function runWatch(source, target, ignored, done) {

        var watcher;
        SOURCE = source;
        TARGET = target;
        IGNORED_FILES = ignored;

        removeDir(TARGET).then(function (value) {
            initialCopyOfFiles(SOURCE, TARGET).then(function (value) {
                watcher = chokidar.watch(SOURCE, {
                    ignored: IGNORED_FILES,
                    persistent: true,
                    ignoreInitial: true
                });

                watcher
                    .on('add', function (path) {
                        copyFile(path, TARGET, function (err) {
                            console.log(err)
                        });
                    })
                    .on('change', function (path) {
                        copyFile(path, TARGET, function (err) {
                            console.log(err)
                        });
                    })
                    .on('unlink', function (path) {
                        deleteFile(TARGET);
                    })
                    .on('error', function (error) {
                        console.error('Error happened', error);
                    })

                watcher.close();
            }, function (error) {
                console.log('ERROR: ' + error);
                done(false);
            });
        }, function (error) {
            console.log('ERROR: ' + error);
            done(false);
        });

    }

    function removeDir(path) {
        var deferred = Q.defer(),
            rmdir = require('rimraf');

        rmdir(path, function (error) {
            if (error) {
                console.log('Failed to DELETE: ' + error);
                deferred.reject('Failed to DELETE: ' + error);
            } else {
                console.log('######## Initial removal of Target directory was OK. ########');
                deferred.resolve('######## Initial removal of Target directory was OK. ########');
            }
        });
        return deferred.promise;
    }

    function initialCopyOfFiles(source, target) {
        function isMatching(filename) {
            return !(IGNORED_FILES.test(filename));
        }

        var deferred = Q.defer(),
            opts = {filter: isMatching};

        ncp(source, target, opts, function (err) {
            if (err) {
                console.log('Error init copy of files');
                deferred.reject('Failed to Initially copy the whole source to target. Error: ', error);
            } else {
                console.log('######## Initial copy of whole directory was OK.     ########');
                deferred.resolve('######## Initial copy of whole directory was OK. ########');
            }
        });
        return deferred.promise;
    }

    function deleteFile(path) {
        var fs = require('fs');
        fs.unlink(path, function (err) {
            if (err) {
                throw err;
            }
            console.log('File: ' + path + ' - deleted OK');
        });
    }

    function copyFile(source, target, cb) {
        var fs = require('fs'),
            tempTarget = source.replace(/\\/g, "/"),
            cbCalled = false;
        tempTarget = tempTarget.replace(SOURCE, '');
        target += tempTarget;
        var rd = fs.createReadStream(source);
        rd.on("error", function (err) {
            done(err);
        });
        var wr = fs.createWriteStream(target);
        wr.on("error", function (err) {
            done(err);
        });
        wr.on("close", function (ex) {
            done();
        });
        rd.pipe(wr);

        function done(err) {
            if (!cbCalled) {
                if (!err) {
                    err = '******** File: ' + source + ' - Copied OK.'
                }
                cb(err);
                cbCalled = true;
            }
        }
    }


};
