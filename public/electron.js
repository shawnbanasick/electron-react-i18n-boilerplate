const electron = require('electron');
const isDev = require("electron-is-dev");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const appConfig = require("electron-settings");
const config = require("./configs/app.config");
const i18n = require("i18next");
const i18nextBackend = require("i18next-node-fs-backend");
const menuFactoryService = require("./services/menuFactory");
const ipcMain = electron.ipcMain;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680, webPreferences: {
    nodeIntegration: true
}});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }


  currentLanguage = "en";

  let pathToTranslation;
  if (isDev) {
    pathToTranslation = path.join(
      __dirname,
      "../build/locales/{{lng}}/{{ns}}.json"
    );
    pathToMissing = path.join(
      __dirname,
      "../build/locales/{{lng}}/{{ns}}.missing.json"
    );
  } else {
    pathToTranslation = path.join(__dirname, "/locales/{{lng}}/{{ns}}.json");
    pathToMissing = path.join(
      __dirname,
      "/locales/{{lng}}/{{ns}}.missing.json"
    );
  }

  const i18nextOptions = {
    backend: {
      loadPath: pathToTranslation,
      addPath: pathToMissing,
      // jsonIndent to use when storing json files
      jsonIndent: 2
    },
    interpolation: {
      escapeValue: false
    },
    keySeparator: ">",
    nsSeparator: "|",
    saveMissing: true,
    fallbackLng: config.fallbackLng,
    whitelist: config.languages,
    react: {
      wait: false
    }
  };

  i18n.use(i18nextBackend);

  // initialize if not already initialized
  if (!i18n.isInitialized) {
    i18n.init(i18nextOptions);
  }

  i18n.on("loaded", loaded => {
    let currentLanguage;
    if (appConfig.has(`currentLanguage`)) {
      currentLanguage = appConfig.get(`currentLanguage`);
    } else {
      currentLanguage = "en";
    }

    i18n.changeLanguage(currentLanguage);
    i18n.off("loaded");
  });

  i18n.on("languageChanged", lng => {
    menuFactoryService.buildMenu(app, mainWindow, i18n);
    mainWindow.webContents.send("language-changed", {
      language: lng,
      namespace: config.namespace,
      resource: i18n.getResourceBundle(lng, config.namespace)
    });

    appConfig.set(`currentLanguage`, lng);
  });



  mainWindow.on('closed', () => mainWindow = null);
}

ipcMain.on("get-initial-translations", (event, arg) => {
  let currentLanguage;
  if (appConfig.has(`currentLanguage`)) {
    currentLanguage = appConfig.get(`currentLanguage`);
  } else {
    currentLanguage = "en";
  }

  i18n.loadLanguages(currentLanguage, (err, t) => {
    const initial = {
      currentLanguage: {
        translation: i18n.getResourceBundle(currentLanguage, config.namespace)
      }
    };
    event.returnValue = initial;
  });

  // todo - fix this ugly hack to get requested language to appear on re-load
  i18n.changeLanguage(currentLanguage);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});