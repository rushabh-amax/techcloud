frappe.provide("frappe.ui");

frappe.ui.ThemeSwitcher = class CustomThemeSwitcher extends frappe.ui.ThemeSwitcher {

    fetch_themes() {
		return new Promise((resolve) => {
			this.themes = [
				{
					name: "light",
					label:("Frappe Light"),
					info:("Light Theme"),
				},
				{
					name: "dark",
					label:"Timeless Night",
					info:"Dark Theme",
				},
				{
					name: "automatic",
					label:"Automatic",
					info:"Uses system's theme to switch between light and dark mode",
				},
                {
                    name:"techcloud",
                    label: "techcloud",
                    info: "techcloud Theme"
                },
				{
                    name:"red",
                    label: "red",
                    info: "red Theme"
                },
				{
                    name:"green",
                    label: "green",
                    info: "green Theme"
                },
              
			];

			resolve(this.themes);
		});
	}
}


// other

