/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MyPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  mySetting: "default"
};
function log(e) {
  if (window._debug) {
    console.log(e);
  }
}
var MyPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    const app = this.app;
    app.workspace.on("file-open", (file) => {
      log(file);
      if ((file == null ? void 0 : file.extension) !== "md") {
        return;
      }
      let isExclude = false;
      this.settings.mySetting.split(",").forEach((folder) => {
        if (file == null ? void 0 : file.path.startsWith(folder.trim())) {
          isExclude = true;
          return;
        }
      });
      if (isExclude) {
        return;
      }
      app.fileManager.processFrontMatter(file, (frontmatter) => {
        log(frontmatter);
        const count = frontmatter["review count"];
        if (!count) {
          frontmatter["review count"] = 1;
        } else {
          frontmatter["review count"] += 1;
        }
      });
    });
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText("Metalogging");
    this.addSettingTab(new SampleSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var SampleSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Settings for Metalog." });
    new import_obsidian.Setting(containerEl).setName("files to exclude").setDesc("you do not want log").addText((text) => text.setPlaceholder("e.g. DailyNotes, Readwise/Articles").setValue(this.plugin.settings.mySetting).onChange(async (value) => {
      console.log("Secret: " + value);
      this.plugin.settings.mySetting = value;
      await this.plugin.saveSettings();
    }));
  }
};
