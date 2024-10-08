# Plugin guide for tdf-cli

Plugins allow you to add features to tdf-cli, such as commands and
extensions to the `toolbox` object that provides the majority of the functionality
used by tdf-cli.

Creating a tdf-cli plugin is easy. Just create a repo with two folders:

```
commands/
extensions/
```

A command is a file that looks something like this:

```js
// commands/foo.js

export default {
  run: (toolbox) => {
    const { print, filesystem } = toolbox

    const desktopDirectories = filesystem.subdirectories(`~/Desktop`)
    print.info(desktopDirectories)
  }
}
```

An extension lets you add additional features to the `toolbox`.

```js
// extensions/bar-extension.js

export default (toolbox) => {
  const { print } = toolbox

  toolbox.bar = () => { print.info('Bar!') }
}
```

This is then accessible in your plugin's commands as `toolbox.bar`.

# Loading a plugin

To load a particular plugin (which has to start with `tdf-cli-*`),
install it to your project using `npm install --save-dev tdf-cli-PLUGINNAME`,
and tdf-cli will pick it up automatically.
