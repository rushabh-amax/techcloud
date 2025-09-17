# techcloud/api/themes.py
import frappe

@frappe.whitelist()
def get_all_themes():
    """Fetch all available themes from Theme doctype"""
    return frappe.get_all(
        "Theme",
        fields=["name", "theme", "custom", "module"]
    )
