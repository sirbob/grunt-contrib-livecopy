# grunt-livecopy

> Watches SOURCE directory for changes and copies them to TARGET directory. Currently, it doesn't watch for folder changes (just files).

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-livecopy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-livecopy');
```

## The "livecopy" task

### Overview
In your project's Gruntfile, add a section named `livecopy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  livecopy: {
    your_target: {
       options: {
          // Target-specific options go here.
        }
    },
  },
})
```

### Options

#### options.source
Type: `String`

The directory, that will be watched for changes.

#### options.target
Type: `String`

The directory, that the files will be copied to upon change.

#### options.ignored
Type: `Regex`

A RegEx, that will be used to filter out unwanted files.

### Usage Examples

#### Default Options


```js
grunt.initConfig({
  livecopy: {
    main: {
      options: {
         source: "c:/your/source/dir/",
         target: "c:/your/target/dir/",
         ignored: /(node_modules|\.gitignore|\.git|\.idea|LIVE_DIR|test|package\.json|\.bowerrc|\.editorconfig\.jshintrc|bower\.json|Gruntfile\.js|\.svn|robots\.txt|htaccess|favicon\.ico|jb_bak|jb_old)/
      },
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 - dev copy
0.1.1 - clean up of dev copy
