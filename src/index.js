const { createWindow } = require("./app");
const {app} = require('electron');

require('./database');

app.whenReady().then(createWindow)
app.allowRendererProcessReuse = false