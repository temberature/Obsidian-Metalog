import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

function log(e: TFile | null) {
	if ((window as any)._debug) {
		console.log(e);
	}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const app = this.app;
		app.workspace.on('file-open', (file) => {
			log(file);
			if(file?.extension !== 'md') {
				return;
			}
			let isExclude = false;

			this.settings.mySetting.split(',').forEach(folder => {
				if(file?.path.startsWith(folder.trim())) {
					isExclude = true;
					return;
				}
			})
			if(isExclude) {
				return;
			}
			app.fileManager.processFrontMatter(file, (frontmatter) => {
				log(frontmatter);
				const count = frontmatter["review count"];
				if(!count) {
					frontmatter["review count"] = 1;
				} else {
					frontmatter["review count"] += 1;
				}
				
			})
		})

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Metalogging');

		// This adds a settings tab so the user can configure various aspects of the plugin
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
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for Metalog.' });

		new Setting(containerEl)
			.setName('files to exclude')
			.setDesc('you do not want log')
			.addText(text => text
				.setPlaceholder('e.g. DailyNotes, Readwise/Articles')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
