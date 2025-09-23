    frappe.ui.keys.add_shortcut({
        shortcut: "alt+t",
        action: () => {
            frappe.set_route("themes");
        },
        description: "Go to Theme Page",
        ignore_inputs: true
    });

    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "g") {
            e.preventDefault();   // block default theme popup
            frappe.set_route("themes"); // redirect to /app/themes
            console.log("Custom Ctrl+Shift+G triggered!");
        }
    });

