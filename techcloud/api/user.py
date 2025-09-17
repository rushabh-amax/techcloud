# user.py

import frappe

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