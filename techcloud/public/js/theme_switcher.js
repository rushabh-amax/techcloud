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
                    name:"astro",
                    label: "astro",
                    info: "astro Theme",
					colors: { 
						primary: "#FF6FD8",   // pink
						secondary: "#6C42C7", // deep violet
						accent: "#FFD600"     // yellow accent
					},
                    solid: false
                },
                {
                    name:"verde",
                    label: "verde",
                    info: "verde Theme",
					colors: { 
						primary: "#1b4332",   // pink
						secondary: "#f0fff4", // deep violet
						accent: "#f0fff4"     // yellow accent
					},
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
					colors: { primary: "#278340" },
                    solid: true
                },
				{
                    name:"blue",
                    label: "blue",
                    info: "blue Theme",
					colors: { primary: "#237DD1" },
                    solid: true
                },
				{
                    name:"purple",
                    label: "purple",
                    info: "purple Theme",
					colors: { primary: "#AF42AE" },
                    solid: true
                },
				{
                    name:"orange",
                    label: "orange",
                    info: "orange Theme",
					colors: { primary: "#E6793B" },
                    solid: true
                },
				{
                    name:"peri",
                    label: "peri",
                    info: "peri Theme",
					colors: { primary: "#645788" },
                    solid: true
                },		
				{
                    name:"cn",
                    label: "cn",
                    info: "shadcn Theme",
					colors: { primary: "#2563eb", secondary: "#64748b", accent: "#0f172a" },
                    solid: false
                },
                { 
                    name: "custom",
                    label: "Custom",
                    info: "User-defined color theme",
                    colors: { primary: "#2563eb" }, // default fallback
                    solid: true
                },
              
			];

			resolve(this.themes);
		});
	}
}


// other

