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
                            </ul>
                            <div class="tab-content mt-3">
                                <div class="tab-pane fade show active" data-fieldname="themes"></div>
                                <div class="tab-pane fade" data-fieldname="solid_colors"></div>
                                <div class="tab-pane fade" data-fieldname="fonts"></div>
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
                <div class="mb-3" style="width:100%; display:flex; align-items:center; gap:8px; margin-bottom:1em;">
                    <label for="user-theme-toggle" style="font-weight:500; cursor:pointer;">Enable Custom Theme for Me Only</label>
                    <input type="checkbox" id="user-theme-toggle">
                </div>
                `);
                $(page.body).prepend(toggleHtml);


                // Initialize switch based on saved preference
                const themeEnabled = frappe.defaults.get_user_default("custom_theme_enabled") === "1";
                $('#user-theme-toggle').prop('checked', themeEnabled);

                // If enabled, apply all user-selected preferences immediately
                if (themeEnabled) {
                    const customColor = frappe.defaults.get_user_default("custom_solid_color") || "#06A7CB";
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
                            .addClass('selected').find('.preview-check').show().css("color", "#06A7CB");
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
                                const color = $('#custom-solid-color').val() || "#06A7CB";
                                applyCustomColor(color);

                                const headingFont = $('#heading-font').val() || "Poppins";
                                const paragraphFont = $('#paragraph-font').val() || "Poppins";
                                loadGoogleFont(headingFont); applyFont('heading', headingFont);
                                loadGoogleFont(paragraphFont); applyFont('paragraph', paragraphFont);

                                const currentTheme = theme_switcher.current_theme;
                                if (currentTheme) {
                                    $('.theme-card.selected').removeClass('selected').find('.preview-check').hide();
                                    $(`.theme-card div[data-theme="${currentTheme}"]`).closest('.theme-card')
                                        .addClass('selected').find('.preview-check').show().css("color", "#06A7CB");
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
                        box-shadow: 0px 6px 10px 0px #f5f5f54d;
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
                    <h6 class="theme-title" style="font-size: 17px;
        margin: .5em 0em;">${t.label}</h6>
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
            themeItem.find(".preview-check").show().css("color", "#06A7CB");
            themeItem.addClass("selected");
        }

        // Click to apply
        themeItem.on("click", function() {
             // If custom theme toggle is ON, turn it off
            if ($('#user-theme-toggle').is(':checked')) {
                $('#user-theme-toggle').prop('checked', false);
                revertToDefaultTheme();
            }


            theme_switcher.toggle_theme(t.name);
            themesContainer.find(".selected")
                .removeClass("selected")
                .find(".preview-check").hide();
            themeItem.find(".preview-check").show().css("color", "#06A7CB");
            themeItem.addClass("selected");
        });

        // Append to container
        themesContainer.append(themeItem);
    });



solidContainer.css({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "12px"
});
// Add custom color picker at the top of the Solid Colors tab
solidContainer.prepend(`
    <div class="mb-3" style="width: 100%; margin-bottom: 1em;">
        <label>Custom Color</label>
        <input type="color" id="custom-solid-color" value="#06A7CB" style="width: 60px; height: 34px; border: none; cursor: pointer;">
    </div>
`);
// ---------------------------
// SOLID COLORS TAB
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
                    <div class="p-2" style="padding:8px; margin-top:1em; height:70px; width:90%;
                        margin-inline:auto; border-radius:8px; box-shadow:0px 6px 10px #f5f5f54d;
                        border:1px solid whitesmoke;">
                        <div class="toolbar">
                            <span class="text"></span>
                            <span class="primary"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-1 text-center" style="text-align:center; margin-top:12px;">
                <h6 class="theme-title" style="font-size:17px; margin:.5em 0;">${t.label}</h6>
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

        solidItem.find(".foreground").eq(0).css({
            height: "6px",
            marginBottom: "3px",
            background: lighter,
            borderRadius: "3px"
        });

        solidItem.find(".foreground").eq(1).css({
            height: "6px",
            background: primary,
            borderRadius: "3px"
        });
    }

    // Preselect current
    if (theme_switcher.current_theme === t.name) {
        solidItem.find(".preview-check").show().css("color", "#06A7CB");
        solidItem.addClass("selected");
    }

    // On click
    solidItem.on("click", function() {
        theme_switcher.toggle_theme(t.name);

        solidContainer.find(".selected")
            .removeClass("selected")
            .find(".preview-check").hide();

        solidItem.find(".preview-check").show().css("color", "#06A7CB");
        solidItem.addClass("selected");
    });

    solidContainer.append(solidItem);
});

// ---------------------------
// CUSTOM COLOR PICKER
// ---------------------------
// ---------------------------
// Custom Solid Color Picker
// ---------------------------

// Utility to generate RGBA from hex
function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.substr(1,2),16);
    let g = parseInt(hex.substr(3,2),16);
    let b = parseInt(hex.substr(5,2),16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// Get saved custom color from user defaults (or fallback)
const savedCustomColor = frappe.defaults.get_user_default("custom_solid_color") || "#06A7CB";

// Set initial value of color picker
$('#custom-solid-color').val(savedCustomColor);

function applyCustomColor(color) {
    // Update theme cards border
    $('.tab-pane[data-fieldname="solid_colors"] .theme-card').css({
        borderColor: color,
    });

    // Primary color variables
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--brand-color', color);
    document.documentElement.style.setProperty('--plyr-color-main', color);
    document.documentElement.style.setProperty('--progress-bar-bg', color);

    // Light shades
    document.documentElement.style.setProperty('--primary-light', hexToRGBA(color, 0.2));
    document.documentElement.style.setProperty('--primary-lighter', hexToRGBA(color, 0.07));

    // --- Buttons ---
    document.documentElement.style.setProperty('--control-bg', color); // button background

    // Dynamically calculate text color for contrast
    const textColor = getContrastColor(color);
    document.documentElement.style.setProperty('--text-color', textColor);
}

// Helper function to get light or dark text based on background color
function getContrastColor(hex) {
    // Remove hash if present
    hex = hex.replace('#', '');

    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);

    // Calculate luminance
    const luminance = (0.299*r + 0.587*g + 0.114*b)/255;

    // Return black for light bg, white for dark bg
    return luminance > 0.6 ? '#000000' : '#ffffff';
}

// Example usage
$('#custom-solid-color').on('input', function() {
    const color = $(this).val();
    applyCustomColor(color);
});


// ---------------------------
// Save color preference on change
// ---------------------------
$('#custom-solid-color').on('change', function() {
    const color = $(this).val();

    frappe.call({
        method: "techcloud.api.user.save_color_preference",
        args: {
            key: "custom_solid_color",
            value: color
        },
        callback: function() {
            // Update local session so it shows selected immediately
            frappe.boot.user.user_preferences = frappe.boot.user.user_preferences || {};
            frappe.boot.user.user_preferences['custom_solid_color'] = color;
        }
    });
});

// Get saved custom color from user defaults (or fallback)
// const savedCustomColor = frappe.defaults.get_user_default("custom_solid_color") || "#06A7CB";

// // Set initial value of color picker
// $('#custom-solid-color').val(savedCustomColor);

// // Apply saved color immediately
// document.documentElement.style.setProperty('--primary-color', savedCustomColor);
// $('.tab-pane[data-fieldname="solid_colors"] .theme-card').css({
//     borderColor: savedCustomColor,
//     boxShadow: `0px 6px 10px ${savedCustomColor}33`
// });

// // Live update on input
// // $('#custom-solid-color').on('input', function() {
// //     const color = $(this).val();

// //     // Apply color to all theme cards
// //     $('.tab-pane[data-fieldname="solid_colors"] .theme-card').css({
// //         borderColor: color,
// //         boxShadow: `0px 6px 10px ${color}33`
// //     });

// //     // Apply as site-wide primary color
// //     document.documentElement.style.setProperty('--primary-color', color);
// // });



// // Save color preference on change
// $('#custom-solid-color').on('change', function() {
//     const color = $(this).val();

//     frappe.call({
//         method: "techcloud.api.user.save_color_preference",
//         args: {
//             key: "custom_solid_color",
//             value: color
//         },
//         callback: function() {
//             // Update local session so it shows selected immediately
//             frappe.boot.user.user_preferences = frappe.boot.user.user_preferences || {};
//             frappe.boot.user.user_preferences['custom_solid_color'] = color;
//         }
//     });
// });


// ---------------------------
// FONTS TAB (Google Fonts Dynamic + Persistence)
// ---------------------------
const googleFonts = [
    "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald",
    "Raleway", "Poppins", "Merriweather", "Nunito", "Ubuntu"
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
        $('h1, h2, h3, h4, h5, h6').css('font-family', `"${font}", sans-serif`);
    } else {
        $('p, span, div').css('font-family', `"${font}", sans-serif`);
    }
}

// Fonts container HTML
fontsContainer.html(`
    <div class="mb-3">
        <label>Heading Font</label>
        <select class="form-control" id="heading-font">
            ${googleFonts.map(f => `<option value="${f}">${f}</option>`).join('')}
        </select>
    </div>
    <div class="mb-3">
        <label>Paragraph Font</label>
        <select class="form-control" id="paragraph-font">
            ${googleFonts.map(f => `<option value="${f}">${f}</option>`).join('')}
        </select>
    </div>
`);

// Load saved defaults
const savedHeadingFont = frappe.defaults.get_user_default("heading_font") || "Poppins";
const savedParagraphFont = frappe.defaults.get_user_default("paragraph_font") || "Poppins";

// Apply fonts immediately
loadGoogleFont(savedHeadingFont);
applyFont('heading', savedHeadingFont);
loadGoogleFont(savedParagraphFont);
applyFont('paragraph', savedParagraphFont);

// Set select values
$('#heading-font').val(savedHeadingFont);
$('#paragraph-font').val(savedParagraphFont);


function saveUserDefault(key, value) {
    frappe.call({
        method: "techcloud.api.user.save_font_preference",
         args: { key, value },
        callback: function() {
            // ensure user_preferences exists
            frappe.boot.user.user_preferences = frappe.boot.user.user_preferences || {};
            frappe.boot.user.user_preferences[key] = value;
        }
    });
}

// Bind change events
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




function revertToDefaultTheme() {
    // Remove any selected theme
    $('.theme-card.selected').removeClass('selected').find('.preview-check').hide();

    // Reset primary color to default
    const defaultColor = "#06A7CB"; // or whatever your default is
    document.documentElement.style.setProperty('--primary', defaultColor);
    document.documentElement.style.setProperty('--brand-color', defaultColor);
    document.documentElement.style.setProperty('--plyr-color-main', defaultColor);
    document.documentElement.style.setProperty('--progress-bar-bg', defaultColor);

    document.documentElement.style.setProperty('--primary-light', 'rgba(6,167,203,0.2)');
    document.documentElement.style.setProperty('--primary-lighter', 'rgba(6,167,203,0.07)');

    // Reset button colors
    document.documentElement.style.setProperty('--control-bg', defaultColor);

    // Reset text color
    document.documentElement.style.setProperty('--text-color', '#ffffff');

    // Reset fonts if needed
    $('h1, h2, h3, h4, h5, h6, p, span, div').css('font-family', '');
}

});
}