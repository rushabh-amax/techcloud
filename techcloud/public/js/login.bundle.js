// =============================
// Custom Password Toggle (No jQuery)
// =============================

// SVG Icons
const eyeSVG = `
<svg class="icon-eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="gray" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="gray" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const eyeSlashSVG = `
<svg class="icon-eye-slash" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="gray" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// Add a custom toggle button next to password inputs
function addCustomPasswordToggle(input) {
  console.log("in login file : in custom toggle funton");
  // Skip if already added
  if (input.parentNode.querySelector(".custom-toggle-password")) return;

  const wrapper = input.parentNode;
  const button = document.createElement("span");
  button.classList.add("custom-toggle-password");
  button.style.cursor = "pointer";
  button.style.marginLeft = "8px";
  button.innerHTML = eyeSlashSVG;

  wrapper.appendChild(button);

  console.log("in login file : apped");


  button.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      button.innerHTML = eyeSVG;
    } else {
      input.type = "password";
      button.innerHTML = eyeSlashSVG;
    }
  });
}

// =============================
// Boot Script
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // Hide the original Frappe toggle
  const style = document.createElement("style");
  style.innerHTML = `
    .toggle-password { display: none !important; }
    .custom-toggle-password svg {
      vertical-align: middle;
    }
  `;
  document.head.appendChild(style);

  // Add to existing password inputs
  document.querySelectorAll('input[type="password"]').forEach(addCustomPasswordToggle);

  // Add observer for dynamically added password fields
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches('input[type="password"]')) {
            addCustomPasswordToggle(node);
          } else {
            const inputs = node.querySelectorAll?.('input[type="password"]') || [];
            inputs.forEach(addCustomPasswordToggle);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});



frappe.ready(function() {
  const heading = document.querySelector(
    'body[frappe-session-status="logged-out"][data-path="login"] .page-card-head h4'
  );

  if (heading) {
    const newLine = document.createElement('p');
    newLine.textContent = "Today is a new day. It's your day. You shape it. Sign in to start managing your projects.";
    newLine.className = "login-subtitle";
    heading.parentNode.insertBefore(newLine, heading.nextSibling);
  }
});



// public/js/navbar_theme_icon.js
frappe.after_ajax(() => {
    const checkNavbar = setInterval(() => {
        let $userDropdown = $(".navbar .dropdown-navbar-user");

        if ($userDropdown.length && !$("#theme-navbar-icon").length) {
            clearInterval(checkNavbar);
            console.log("Injecting theme icon near avatar...");

            let svgIcon = `
                <li id="theme-navbar-icon" class="nav-item" 
                    style="display:flex;align-items:center;cursor:pointer;margin-right:8px;">
                    <button class="btn-theme btn-reset nav-link" title="Theme Hub">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                    </button>
                </li>
            `;

            // Insert just before avatar dropdown
            $userDropdown.before(svgIcon);

            // Add click handler
            $("#theme-navbar-icon").on("click", () => {
                frappe.set_route("themes");
            });
        }
    }, 300);
});

