# [Gulp](http://gulpjs.com) Plugin for [DocPad](http://docpad.org)

Run [gulp](http://gulpjs.com) tasks when building with [DocPad](https://docpad.org).


## Install

```bash
$ docpad install gulp
```


## Configure

By default, the plugin will run the `default` tasks associated with gulp during
the [writeAfter](http://docpad.org/docs/events#writeafter) event with DocPad.
This is equivilant to adding the following configuration to your [DocPad
configuration file](http://docpad.org/docs/config):

```coffeescript
  plugins:
    gulp:
      writeAfter: []
```

The following will run the `"cssmin"` task from gulp during the
[generateAfter](http://docpad.org/docs/events#generateafter) event:

```coffeescript
  plugins:
    gulp:
      writeAfter: false
      generateAfter: ["cssmin"]
```


<!-- HISTORY/ -->

## History
[You can discover the history inside the `HISTORY.md` file](https://github.com/terminalpixel/docpad-plugin-gulp/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contributing
[You can discover the contributing instructions inside the `CONTRIBUTING.md` file](https://github.com/terminalpixel/docpad-plugin-gulp/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Rob Loach (https://github.com/robloach)

### Contributors

These amazing people have contributed code to this project:

- Rob Loach (https://github.com/robloach) - [view contributions](https://github.com/robloach/docpad-plugin-grunt/commits?author=RobLoach)
- Eric Vantillard (https://github.com/evantill) - [view contributions](https://github.com/robloach/docpad-plugin-grunt/commits?author=evantill)

[Become a contributor!](https://github.com/robloach/docpad-plugin-grunt/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License
Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2013 [Rob Loach](http://robloach.net)

<!-- /LICENSE -->
