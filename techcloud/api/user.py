# user.py

import frappe
from frappe.utils.file_manager import save_file




@frappe.whitelist()
def save_font_preference(key, value):
    frappe.defaults.set_user_default(key, value, user=frappe.session.user)
    return {"status": "ok"}

@frappe.whitelist()
def save_color_preference(key, value):
    frappe.defaults.set_user_default(key, value, user=frappe.session.user)
    return {"color-status": "ok"}

@frappe.whitelist()
def save_user_theme_toggle(enabled: bool):
    """
    Save theme toggle preference for current user.
    enabled = True/False
    """
    frappe.defaults.set_user_default("custom_theme_enabled", "1" if enabled else "0", user=frappe.session.user)
    return {"status": "ok"}




@frappe.whitelist()
def save_bg_image(filedata=None, sticky=None):
    """Save background image and sticky preference"""

    # Ensure folder exists
    folder_name = "Backgrounds"
    parent_folder = "Home"
    folder = frappe.get_all(
        "File", filters={"is_folder": 1, "file_name": folder_name, "folder": parent_folder}, limit=1
    )
    if not folder:
        # Create folder
        folder_doc = frappe.get_doc({
            "doctype": "File",
            "file_name": folder_name,
            "is_folder": 1,
            "folder": parent_folder
        })
        folder_doc.insert(ignore_permissions=True)

    if filedata:
        # Save the file under the folder
        file_doc = save_file(
            fname="bg_image.png",
            content=filedata,
            dt=None,
            dn=None,
            folder=f"{parent_folder}/{folder_name}",
            decode=True
        )

        # Save URL in user defaults
        frappe.defaults.set_user_default("bg_image", file_doc.file_url, frappe.session.user)

    if sticky is not None:
        frappe.defaults.set_user_default("bg_image_sticky", sticky, frappe.session.user)

    return {"status": "ok"}

@frappe.whitelist()
def get_bg_image():
    """Return saved background image and sticky preference"""
    return {
        "bg_image": frappe.defaults.get_user_default("bg_image", user=frappe.session.user),
        "bg_image_sticky": frappe.defaults.get_user_default("bg_image_sticky", user=frappe.session.user)
    }