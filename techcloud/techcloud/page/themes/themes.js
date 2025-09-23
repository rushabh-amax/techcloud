    frappe.pages['themes'].on_page_load = function(wrapper) {
        let page = frappe.ui.make_app_page({
            parent: wrapper,
            title: 'Theme Hub',
            single_column: true
        });

        let theme_switcher = new frappe.ui.ThemeSwitcher();

        theme_switcher.fetch_themes().then((themes) => {
            if (!themes || !themes.length) {
                $(page.body).html("<p>No themes found.</p>");
                return;
            }
       

            // ---------------------------
            // Frappe Tabs HTML
            // ---------------------------
            let tabs_html = $(`
                <div class="form-layout">
                    <div class="form-page">
                        <div class="form-tabs-list">
                            <ul class="nav form-tabs" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" data-fieldname="themes" role="tab">Themes</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-fieldname="solid_colors" role="tab">Solid Colors</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-fieldname="fonts" role="tab">Fonts</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-fieldname="bg_image" role="tab">BG Image</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-fieldname="Advanced Settings" role="tab">Advanced Settings</a>
                                </li>
                            </ul>
                            <div class="tab-content mt-3">
                                <div class="tab-pane fade show active" data-fieldname="themes"></div>
                                <div class="tab-pane fade" data-fieldname="solid_colors"></div>
                                <div class="tab-pane fade" data-fieldname="fonts"></div>
                                <div class="tab-pane fade" data-fieldname="bg_image"></div>

                                <div class="tab-pane fade" data-fieldname="Advanced Settings">
                                <p style="text-align:center;padding-block: 10em;">comming soon</p>
                                </div>
                                

                            </div>
                        </div>
                    </div>
                </div>
            `);

            $(page.body).html(tabs_html);

            let themesContainer = $('.tab-pane[data-fieldname="themes"]');
            let solidContainer = $('.tab-pane[data-fieldname="solid_colors"]');
            let fontsContainer = $('.tab-pane[data-fieldname="fonts"]');


                     // At the very top, inside tabs_html container or right after $(page.body).html(tabs_html)

                const toggleHtml = $(`
                <div class="mb-3 theme-toggle-container" style="
                width:100%;
                gap:8px; 
                margin-bottom:1em;
                display: flex;
                align-items: center;
                padding-block: 1em;
                justify-content: start;
                border-bottom: 1.4px solid var(--control-bg);
                ">
                    <label for="user-theme-toggle" style="margin-bottom: unset; font-weight:500; cursor:pointer;">Only For Me</label>
                    <input type="checkbox" id="user-theme-toggle">
                </div>
                `);
                $(page.body).prepend(toggleHtml);


                // Initialize switch based on saved preference
                const themeEnabled = frappe.defaults.get_user_default("custom_theme_enabled") === "1";
                $('#user-theme-toggle').prop('checked', themeEnabled);

                // If enabled, apply all user-selected preferences immediately
                if (themeEnabled) {
                    const customColor = frappe.defaults.get_user_default("custom_solid_color") || "whitesmoke";
                    applyCustomColor(customColor);

                    const headingFont = frappe.defaults.get_user_default("heading_font") || "Poppins";
                    const paragraphFont = frappe.defaults.get_user_default("paragraph_font") || "Poppins";
                    loadGoogleFont(headingFont); applyFont('heading', headingFont);
                    loadGoogleFont(paragraphFont); applyFont('paragraph', paragraphFont);

                    // Apply theme card selection
                    const currentTheme = theme_switcher.current_theme;
                    if (currentTheme) {
                        $('.theme-card.selected').removeClass('selected').find('.preview-check').hide();
                        $(`.theme-card div[data-theme="${currentTheme}"]`).closest('.theme-card')
                            .addClass('selected').find('.preview-check').show().css("color", "whitesmoke");
                    }
                }

                $('#user-theme-toggle').on('change', function() {
                        const enabled = $(this).is(':checked');

                    if (enabled) {
                        // Deselect all prebuilt themes
                        $('.theme-card.selected').removeClass('selected').find('.preview-check').hide();
                    }

                    frappe.call({
                        method: "techcloud.api.user.save_user_theme_toggle",
                        args: { enabled },
                        callback: function() {
                            if (enabled) {
                                // Apply everything user-selected
                                const color = $('#custom-solid-color').val() || "whitesmoke";
                                applyCustomColor(color);

                                const headingFont = $('#heading-font').val() || "Poppins";
                                const paragraphFont = $('#paragraph-font').val() || "Poppins";
                                loadGoogleFont(headingFont); applyFont('heading', headingFont);
                                loadGoogleFont(paragraphFont); applyFont('paragraph', paragraphFont);

                                const currentTheme = theme_switcher.current_theme;
                                if (currentTheme) {
                                    $('.theme-card.selected').removeClass('selected').find('.preview-check').hide();
                                    $(`.theme-card div[data-theme="${currentTheme}"]`).closest('.theme-card')
                                        .addClass('selected').find('.preview-check').show().css("color", "whitesmoke");
                                }
                            } else {
                                // Revert to default/light theme for this user
                                revertToDefaultTheme();
                                $('h1, h2, h3, h4, h5, h6, p, span, div').css('font-family', '');
                            }
                        }
                    });
                });

            // ---------------------------
            // Tab Switching
            // ---------------------------
    $(page.body).on('click', '.form-tabs .nav-link', function(e) {
        e.preventDefault();
        let fieldname = $(this).data('fieldname');

        // toggle tab link active
        $(this).closest('.form-tabs').find('.nav-link').removeClass('active');
        $(this).addClass('active');

        // toggle tab pane visibility
        let wrapper = $(this).closest('.form-tabs-list');
        wrapper.find('.tab-pane').removeClass('show active').hide();
        wrapper.find(`.tab-pane[data-fieldname="${fieldname}"]`).addClass('show active').show();
    });






    // --- before loop, style the container ---
    themesContainer.css({
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: "12px"
    });

    // --- inside your loop ---
    themes.filter(t => !t.solid).forEach((t) => {
        let themeItem = $(`
            <div class="theme-card"
                style="flex: 1 1 calc(20% - 20px); max-width: calc(20% - 20px); 
                    cursor:pointer; min-width:150px; display: flex
    ;flex-direction: column; height: 185px;">

                <div data-theme="${t.name}" data-is-auto-theme="false" title="${t.info}" style="border-radius: 1em; flex: 1;">
                    <div class="background" style="border:1px solid #ddd; border-radius:4px; overflow:hidden;height: 100%;
        border-radius: 1em;     position: relative;">
                        <div>
                            <div class="preview-check" data-theme="${t.name}" style="display:none; position: absolute;
                                    bottom: 7px;
                                    right: 7px;
                                    background:whitesmoke;
                                    border-radius: 50em;
                                    width: 32px;
                                    text-align: center; ">
                                <svg class="icon icon-xs" aria-hidden="true">
                                    <use href="#icon-tick"></use>
                                </svg>
                            </div>
                        </div>
                        <div class="navbar"></div>
                        <div class="p-2" style="padding:8px;
                        margin-top: 1em;
                        height: 70px;
                        width: 90%;
                        margin-inline: auto;
                        border-radius: 8px;
                        box-shadow: 0px 6px 10px 0px  ${hexToRGBA(t.colors.primary, 0.05)};
                        border: 1px solid whitesmoke;
    
                        ">
                            <div class="toolbar">
                                <span class="text"></span>
                                <span class="primary"></span>
                            </div>
                        
                        </div>
                    </div>
                </div>

                <div class="mt-1 text-center" style="text-align:center; margin-top:12px;">
                    <p class="theme-title" style="font-size: 14px;
        margin: .5em 0em;">${t.label}</p>
                </div>
            </div>
        `);

        // Apply dynamic colors
        if (t.colors) {
            let colorKeys = Object.keys(t.colors);

            themeItem.find(".navbar").css({
                background: t.colors[colorKeys[0]] || "#f5f5f5",
                height: "16px",
                width: "44px",
                margin: "5px .25em 0 auto",
                borderRadius: "50em",
                marginRight: "6px",
                marginTop: "6px",
                marginBottom: "10px"
            });

            themeItem.find(".toolbar").css({
                height: "6px",
                marginBottom: "3px",
                background: t.colors[colorKeys[1]] || "#eee"
            });

            themeItem.find(".foreground").eq(0).css({
                height: "6px",
                marginBottom: "3px",
                background: t.colors[colorKeys[2]] || "#ddd"
            });
            themeItem.find(".foreground").eq(1).css({
                height: "6px",
                background: t.colors[colorKeys[3]] || "#ddd"
            });

            // toolbar span dots
            themeItem.find(".toolbar .text").css({
                display: "inline-block",
                width: "6px",
                height: "6px",
                marginRight: "2px",
                borderRadius: "50%",
                background: t.colors[colorKeys[2]] || "#ccc"
            });
            themeItem.find(".toolbar .primary").css({
                display: "inline-block",
                width: "12px",
                height: "6px",
                borderRadius: "3px",
                background: t.colors[colorKeys[0]] || "#000"
            });
        }

        // Selected tick
        if (theme_switcher.current_theme === t.name) {
            themeItem.find(".preview-check").show().css("color", "whitesmoke");
            themeItem.addClass("selected");
        }

        // Click to apply
        // themeItem.on("click", function() {
        //      // If custom theme toggle is ON, turn it off
        //     if ($('#user-theme-toggle').is(':checked')) {
        //         $('#user-theme-toggle').prop('checked', false);
        //         revertToDefaultTheme();
        //     }

            


        //     theme_switcher.toggle_theme(t.name);
        //     themesContainer.find(".selected")
        //         .removeClass("selected")
        //         .find(".preview-check").hide();
        //     themeItem.find(".preview-check").show().css("color", "whitesmoke");
        //     themeItem.addClass("selected");
        // });

        themeItem.on("click", function() {
    if ($('#user-theme-toggle').is(':checked')) {
        $('#user-theme-toggle').prop('checked', false);
        revertToDefaultTheme();
    }

    // ✅ Persist + update both attributes
    frappe.ui.set_theme(t.name);

    // ✅ Still call your ThemeSwitcher to save preference
    theme_switcher.toggle_theme(t.name);

    themesContainer.find(".selected")
        .removeClass("selected")
        .find(".preview-check").hide();
    themeItem.find(".preview-check").show().css("color", "whitesmoke");
    themeItem.addClass("selected");
});


        // Append to container
        themesContainer.append(themeItem);
    });

// ---------------------------
// SOLID COLORS TAB CONTAINER
// ---------------------------
solidContainer.css({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "12px"
});

// --- Custom Color Picker Card ---
let customColorCard = $(`
    <div class="theme-card custom-color-card"
        style="flex: 1 1 calc(20% - 20px); max-width: calc(20% - 20px);
            cursor:pointer; min-width:150px; display:flex; flex-direction:column; height:185px;">

        <div class="background" style="border:1px solid #ddd; border-radius:1em; overflow:hidden;
                height:100%; position:relative; display:flex; align-items:center; justify-content:center; flex-direction:column;">
            
            <!-- Tick check -->
            <div class="preview-check" style="display:none; position:absolute; bottom:7px; right:7px;
                    background:whitesmoke; border-radius:50em; width:32px; text-align:center;">
                <svg class="icon icon-xs" aria-hidden="true">
                    <use href="#icon-tick"></use>
                </svg>
                
            </div>
           

            <!-- Badge -->
            <span class="badge" style="background:#f1f1f1; color:#333; 
                padding:4px 10px; border-radius:50em; font-size:13px; font-weight:500;
                margin-bottom:10px;">Choose Color</span>

            <!-- Color Picker -->
            <input type="color" id="custom-solid-color" value="#000" 
                style="width:60px; border-radius:50em;   height:34px; border:none; cursor:pointer; background:transparent;">
        </div>

        <div class="mt-1 text-center" style="text-align:center; margin-top:12px;">
            <p class="theme-title" style="font-size:14px; margin:.5em 0;">Custom</p>
        </div>
    </div>
`);

solidContainer.prepend(customColorCard);



// ---------------------------
// SOLID COLORS LOOP
// ---------------------------
themes.filter(t => t.solid).forEach((t) => {
    let solidItem = $(`
        <div class="theme-card"
            style="flex: 1 1 calc(20% - 20px); max-width: calc(20% - 20px); 
                cursor:pointer; min-width:150px; display:flex; flex-direction:column; height:185px;">

            <div data-theme="${t.name}" data-is-auto-theme="false" title="${t.info}" 
                 style="border-radius:1em; flex:1;">
                <div class="background" 
                     style="border:1px solid #ddd; border-radius:1em; overflow:hidden;
                            height:100%; position:relative;">
                    <div class="preview-check" data-theme="${t.name}" style="display:none; position: absolute;
                            bottom:7px; right:7px; background:whitesmoke;
                            border-radius:50em; width:32px; text-align:center;">
                        <svg class="icon icon-xs" aria-hidden="true">
                            <use href="#icon-tick"></use>
                        </svg>
                    </div>

                    <div class="navbar"></div>
                    <div class="p-2" style="padding:8px; margin-top:1em; height:70px; width:90%;
                        margin-inline:auto; border-radius:8px; box-shadow:0px 6px 10px  ${hexToRGBA(t.colors.primary, 0.05)};
                        border:1px solid whitesmoke;">
                        <div class="toolbar">
                            <span class="text"></span>
                            <span class="primary"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-1 text-center" style="text-align:center; margin-top:12px;">
                <p class="theme-title" style="font-size:14px; margin:.5em 0;">${t.label}</p>
            </div>
        </div>
    `);

    // Apply solid colors
    if (t.colors) {
        let primary = t.colors.primary || "#999";
        let light = `${primary}33`;
        let lighter = `${primary}11`;

        solidItem.find(".navbar").css({
            background: primary,
            height: "16px",
            width: "44px",
            margin: "6px 6px 10px auto",
            borderRadius: "50em"
        });

        solidItem.find(".toolbar").css({
            height: "6px",
            marginBottom: "3px",
            background: light,
            borderRadius: "3px"
        });

        solidItem.find(".toolbar .text").css({
            display: "inline-block",
            width: "6px",
            height: "6px",
            marginRight: "2px",
            borderRadius: "50%",
            background: lighter
        });

        solidItem.find(".toolbar .primary").css({
            display: "inline-block",
            width: "12px",
            height: "6px",
            borderRadius: "3px",
            background: primary
        });
    }

    // Preselect current
    if (theme_switcher.current_theme === t.name) {
        solidItem.find(".preview-check").show().css("color", "whitesmoke");
        solidItem.addClass("selected");
    }

    // On click
    solidItem.on("click", function() {
        theme_switcher.toggle_theme(t.name);

        solidContainer.find(".selected")
            .removeClass("selected")
            .find(".preview-check").hide();

        solidItem.find(".preview-check").show().css("color", "whitesmoke");
        solidItem.addClass("selected");

        // Deselect custom card
        customColorCard.removeClass("selected").find(".preview-check").hide();
    });

    solidContainer.append(solidItem);
});

// ---------------------------
// CUSTOM COLOR PICKER HANDLING
// ---------------------------

// hex → rgba
function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.substr(1,2),16);
    let g = parseInt(hex.substr(3,2),16);
    let b = parseInt(hex.substr(5,2),16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// contrast color
function getContrastColor(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminance > 0.6 ? '#000' : '#fff';
}

// apply color
function applyCustomColor(color) {
    const hover = hexToRGBA(color, 0.85);
    const border = hexToRGBA(color, 0.15);
    const muted = hexToRGBA(color, 0.05);
    const mutedHover = hexToRGBA(color, 0.1);
    const textColor = getContrastColor(color);

    const css = `
        [data-theme="custom"] {
            --primary: ${color};
            --primary-hover: ${hover};
            --secondary: ${border};
            --secondary-hover: ${mutedHover};
            --background: #000;
            --foreground: ${textColor};
            --muted: ${muted};
            --muted-hover: ${mutedHover};
            --border-color: ${border};
            --text-muted: #64748b;
            --tabBeforeSlide:${color};
        }
    `;

    let styleTag = document.getElementById("custom-theme-style");
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "custom-theme-style";
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = css;  
}

// ---------------------------
// INIT: Load saved theme & color
// ---------------------------
function initCustomTheme() {
    const savedColor = frappe.boot.user.user_preferences?.custom_solid_color || "#2563eb";
    const currentTheme = frappe.boot.user.user_preferences?.current_theme;

    if (currentTheme === "custom") {
        $('#custom-solid-color').val(savedColor);
        theme_switcher.current_theme = "custom";
        document.documentElement.setAttribute("data-theme", "custom");
        document.documentElement.setAttribute("data-theme-mode", "custom");
        applyCustomColor(savedColor);

        solidContainer.find(".selected").removeClass("selected").find(".preview-check").hide();
        customColorCard.addClass("selected").find(".preview-check").show();
    }
}

// ---------------------------
// EVENT: Live preview
// ---------------------------
$('#custom-solid-color').on('input', function() {
    const color = $(this).val();
    theme_switcher.current_theme = "custom";
    document.documentElement.setAttribute("data-theme", "custom");
    applyCustomColor(color);

    solidContainer.find(".selected").removeClass("selected").find(".preview-check").hide();
    customColorCard.addClass("selected").find(".preview-check").show();
});

// ---------------------------
// EVENT: Persist color + theme
// ---------------------------
$('#custom-solid-color').on('change', function() {
    const color = $(this).val();
    theme_switcher.current_theme = "custom";
    document.documentElement.setAttribute("data-theme", "custom");
    document.documentElement.setAttribute("data-theme-mode", "custom");
    applyCustomColor(color);

    // Save both color + active theme
    frappe.call({
        method: "techcloud.api.user.save_color_preference",
        args: { key: "custom_solid_color", value: color },
        callback: function() {
            frappe.boot.user.user_preferences = frappe.boot.user.user_preferences || {};
            frappe.boot.user.user_preferences['custom_solid_color'] = color;

            frappe.call({
                method: "techcloud.api.user.save_color_preference",
                args: { key: "current_theme", value: "custom" },
                callback: function() {
                    frappe.boot.user.user_preferences['current_theme'] = "custom";
                }
            });
        }
    });
});

// initialize
initCustomTheme();

// ---------------------------
// FONTS TAB (Google Fonts Dynamic + Persistence)
// ---------------------------
const googleFonts = [
    "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald",
    "Raleway", "Poppins", "Merriweather", "Nunito", "Ubuntu",
     "Inter", "Work Sans", "DM Sans", "Fira Sans", "IBM Plex Sans",
    "Hind", "Exo 2", "Manrope", "Sora", "Karla",
    "Mulish", "Archivo", "Overpass", "Public Sans", "Space Grotesk",
    "JetBrains Mono", "Comfortaa", "Quicksand", "Red Hat Display", "Chivo"
];

function loadGoogleFont(fontName) {
    const linkId = `google-font-${fontName.replace(/\s+/g, '-')}`;
    if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        document.head.appendChild(link);
    }
}

function applyFont(type, font) {
    if (type === 'heading') {
        $('h1, h2, h3, h4, h5').css('font-family', `"${font}", sans-serif`);
    } else {
        $(' h6 , p, span, div,a,label').css('font-family', `"${font}", sans-serif`);
    }
}

// Fonts container HTML
fontsContainer.html(`
    <div class="mb-3">
        <label>Heading Font</label>
        <select class="form-control" style="height:40px" id="heading-font">
            ${googleFonts.map(f => `<option value="${f}">${f}</option>`).join('')}
        </select>
    </div>
    <div class="mb-3">
        <label>Paragraph Font</label>
        <select class="form-control"  style="height:40px" id="paragraph-font">
            ${googleFonts.map(f => `<option value="${f}">${f}</option>`).join('')}
        </select>
    </div>
`);

const savedHeadingFont = frappe.defaults.get_user_default("heading_font") || "Poppins";
const savedParagraphFont = frappe.defaults.get_user_default("paragraph_font") || "Poppins";

// Apply fonts immediately
loadGoogleFont(savedHeadingFont);
applyFont('heading', savedHeadingFont);
loadGoogleFont(savedParagraphFont);
applyFont('paragraph',  savedParagraphFont);

// Set select values
$('#heading-font').val(savedHeadingFont);
$('#paragraph-font').val(savedParagraphFont);


function saveUserDefault(key, value) {
    frappe.call({
        method: "techcloud.api.user.save_font_preference",
         args: { key, value },
        callback: function() {
            frappe.boot.user.user_preferences = frappe.boot.user.user_preferences || {};
            frappe.boot.user.user_preferences[key] = value;
        }
    });
}

$('#heading-font').on('change', function() {
    const font = $(this).val();
    loadGoogleFont(font);
    applyFont('heading', font);
    saveUserDefault('heading_font', font);
});

$('#paragraph-font').on('change', function() {
    const font = $(this).val();
    loadGoogleFont(font);
    applyFont('paragraph', font);
    saveUserDefault('paragraph_font', font);
});


//==============================
//== Background Image Picker with Persistence
//===============================
//==============================
//== Background Image Picker with Preview & Persistence
//===============================
let bgImageContainer = $('.tab-pane[data-fieldname="bg_image"]');

bgImageContainer.html(`
   <div class="bg-image-card shadow-sm" style="
    display:flex; 
    flex-direction:column;
    align-items:flex-start; 
    border-radius: 1em;
    padding: 20px; 
    min-height:240px;
    margin: auto;
    transition: all 0.3s ease;
    position: relative;
    background:#fff;
">
  <!-- Info text -->
  <p style="
        font-size:12px;
        color:#666;
        opacity:0.85;
        line-height:1.4;
        margin-bottom: 14px;
    ">
      This feature works best with <b>solid themes</b>.<br>
      For subtle effect, try <b>low-opacity</b> images.
  </p>

  <!-- Actions -->
  <button class="btn btn-primary" id="bg-image-attach-btn" style="
      padding:8px 16px; 
      font-size:14px;
      border-radius:0.5em;
      transition: all 0.3s ease;
      margin-bottom: 10px;
  ">
    Attach Image
  </button>
  <input type="file" id="bg-image-picker" accept="image/*" style="display:none;">

  <!-- Sticky option -->
  <label style="font-size:13px; cursor:pointer; margin-bottom:12px;">
      <input type="checkbox" id="bg-image-sticky"> Stick image to body
  </label>

  <!-- Preview -->
  <img id="bg-image-preview" src="" style="
      display:none;
      width:100%;
      max-height:500px;
      border-radius:0.75em;
      object-fit:cover;
      box-shadow:0 2px 6px rgba(0,0,0,0.15);
  ">
</div>

`);

//--------------------------
// Open file picker
//--------------------------
$('#bg-image-attach-btn').on('click', function() {
    $('#bg-image-picker').click();
});

//--------------------------
// Apply BG image + preview + persist
//--------------------------
$('#bg-image-picker').on('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const filedata = e.target.result;

        // Show preview
        $('#bg-image-preview').attr('src', filedata).fadeIn(300);

        // Apply to body
        document.body.style.background = `url(${filedata}) !important`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';

        // Save using API
        const sticky = $('#bg-image-sticky').is(':checked') ? "1" : "0";
        frappe.call({
            method: "techcloud.api.user.save_bg_image",
            args: { filedata, sticky },
        });
    }
    reader.readAsDataURL(file);
});

//--------------------------
// Sticky toggle (optimized)
//--------------------------
$('#bg-image-sticky').on('change', function() {
    document.body.style.backgroundAttachment = this.checked ? 'fixed' : 'scroll';

    // Only save sticky; no need to resend base64
    frappe.call({
        method: "techcloud.api.user.save_bg_image",
        args: { sticky: this.checked ? "1" : "0" },
    });
});

//--------------------------
// Load saved BG image + sticky preference
//--------------------------
function initBGImage() {
    frappe.call({
        method: "techcloud.api.user.get_bg_image",
        callback: function(r) {
            if (!r.message) return;

            const savedBg = r.message.bg_image;
            const sticky = r.message.bg_image_sticky === "1";

            if (savedBg) {
                $('#bg-image-preview').attr('src', savedBg).show();
                  const style = document.createElement('style');
                    style.innerHTML = `body { background-image: url(${savedBg}) !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center !important; }`;
                    document.head.appendChild(style);
                // document.body.style.backgroundImage = `url(${savedBg}) !important`;
         
            }

            if (sticky) {
                $('#bg-image-sticky').prop('checked', true);
                document.body.style.backgroundAttachment = 'fixed';
            } else {
                $('#bg-image-sticky').prop('checked', false);
                document.body.style.backgroundAttachment = 'scroll';
            }
        }
    });
}

//--------------------------
// Initialize BG image on page load
//--------------------------
initBGImage();

// Revert theme including BG image
function revertToDefaultTheme() {
    $('.theme-card.selected').removeClass('selected').find('.preview-check').hide();

    // Reset primary color to default
    const defaultColor = "whitesmoke"; 
    document.documentElement.style.setProperty('--primary', defaultColor);
    document.documentElement.style.setProperty('--brand-color', defaultColor);
    document.documentElement.style.setProperty('--plyr-color-main', defaultColor);
    document.documentElement.style.setProperty('--progress-bar-bg', defaultColor);
    document.documentElement.style.setProperty('--primary-light', 'rgba(6,167,203,0.2)');
    document.documentElement.style.setProperty('--primary-lighter', 'rgba(6,167,203,0.07)');
    document.documentElement.style.setProperty('--control-bg', defaultColor);
    document.documentElement.style.setProperty('--text-color', '#444');
    $('h1, h2, h3, h4, h5, h6, p, span, div,a').css('font-family', '');

    // Reset BG image
    $('#bg-image-preview').hide().attr('src','');
    $('#bg-image-sticky').prop('checked', false);
    document.body.style.backgroundImage = '';
    document.body.style.backgroundAttachment = 'scroll';

    // Clear saved BG preferences
    frappe.call({ method: "techcloud.api.user.save_bg_image", args: { filedata: null, sticky: "0" }});
}


});
}
