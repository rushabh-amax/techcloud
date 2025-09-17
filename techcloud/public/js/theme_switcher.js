frappe.provide("frappe.ui");

frappe.ui.ThemeSwitcher = class CustomThemeSwitcher extends frappe.ui.ThemeSwitcher {

    fetch_themes() {
		return new Promise((resolve) => {
			this.themes = [
				{
					name: "light",
					label:("Frappe Light"),
					info:("Light Theme"),
					colors: { primary: "whitesmoke", secondary: "#DEDEDE", accent: "whitesmoke" },
                    solid: false
				},
				{
					name: "dark",
					label:"Timeless Night",
					info:"Dark Theme",
					colors: { primary: "#333", secondary: "#555", accent: "#333" },
                    solid: false
				},
				{
					name: "automatic",
					label:"Automatic",
					info:"Uses system's theme to switch between light and dark mode",
							colors: { primary: "#333", secondary: "whitesmoke", accent: "whitesmoke" },
                    solid: false
				},
                {
                    name:"techcloud",
                    label: "techcloud",
                    info: "techcloud Theme",
					colors: { primary: "#EE5225", secondary: "#067ACB", accent: "#EE5225" },
                    solid: false
                },
				{
                    name:"red",
                    label: "red",
                    info: "red Theme",
					colors: { primary: "#D72638" },
                    solid: true
                },
				{
                    name:"green",
                    label: "green",
                    info: "green Theme",
					colors: { primary: "#2E7D32" },
                    solid: true
                },
              
			];

			resolve(this.themes);
		});
	}
}


// other

