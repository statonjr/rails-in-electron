// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import fetch from 'node-fetch';
import path from 'path';
import * as childProcess from 'child_process';

const createWindow = (railsApp: any) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true
      // preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

   // Emitted when the window is closed.
   mainWindow.on('closed', function() {
    railsApp.kill('SIGINT')
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const railsApp = childProcess.spawn('rails', ['s']);

  console.log("Starting Rails server. Waiting 5 seconds...")

  const start = async () => {
    const res = await fetch('http://localhost:3000');
    console.log('Rails server started');
    createWindow(railsApp);
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow(railsApp)
    });
  }

  setTimeout(() => start(), 5000);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});
