(() => {
  // ../techcloud/techcloud/public/js/customJs.bundle.js
  document.addEventListener("DOMContentLoaded", function() {
    function initSlidingTabs(ul) {
      if (!ul || ul.dataset.slidingTabsInitialized)
        return;
      ul.dataset.slidingTabsInitialized = "1";
      ul.style.position = ul.style.position || "relative";
      const bar = document.createElement("div");
      bar.className = "sliding-tab-bar";
      Object.assign(bar.style, {
        position: "absolute",
        bottom: "0",
        height: "4px",
        background: "var(--tabBeforeSlide)  ",
        borderRadius: "1em 1em 0em 0em",
        transition: "transform 200ms ease, width 200ms ease",
        left: "0",
        width: "0",
        zIndex: "1",
        pointerEvents: "none"
      });
      ul.appendChild(bar);
      console.log("tab active slideer insterd");
      const update = () => {
        const active = ul.querySelector(".nav-link.active") || ul.querySelector(".nav-link");
        if (!active)
          return;
        const linkRect = active.getBoundingClientRect();
        const ulRect = ul.getBoundingClientRect();
        const left = linkRect.left - ulRect.left + ul.scrollLeft;
        bar.style.width = linkRect.width + "px";
        bar.style.transform = `translateX(${left}px)`;
      };
      ul.addEventListener("click", (e) => {
        const link = e.target.closest(".nav-link");
        if (link && ul.contains(link)) {
          setTimeout(update, 150);
        }
      });
      window.addEventListener("resize", update);
      const mo = new MutationObserver(() => update());
      mo.observe(ul, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
      setTimeout(update, 0);
    }
    function scanAndInit() {
      document.querySelectorAll("ul.form-tabs, ul.nav-tabs, #form-tabs").forEach(initSlidingTabs);
    }
    scanAndInit();
    const bodyObserver = new MutationObserver(() => scanAndInit());
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", (e) => {
      if (e.target.closest('a[data-toggle="tab"], a[data-bs-toggle="tab"]')) {
        setTimeout(scanAndInit, 200);
      }
    });
  });
  document.addEventListener("DOMContentLoaded", function() {
    console.log("Awesomplete shift start");
    const observer = new MutationObserver(() => {
      const activeInput = document.querySelector(
        ".form-grid .awesomplete input:focus[aria-owns]"
      );
      if (activeInput) {
        const listId = activeInput.getAttribute("aria-owns");
        const list = document.getElementById(listId);
        if (list) {
          console.log("Focused input:", activeInput.dataset.fieldname, activeInput);
          console.log("Dropdown list:", listId, list);
          if (!list.dataset.shifted) {
            list.dataset.shifted = "1";
            document.body.appendChild(list);
            list.style.position = "absolute";
            list.style.background = "white";
            list.style.width = "350px";
            list.style.border = "1.4px solid whitesmoke";
            list.style.zIndex = "9999";
            list.hidden = false;
          }
          const rect = activeInput.getBoundingClientRect();
          list.style.top = rect.bottom + window.scrollY + "px";
          list.style.left = rect.left + window.scrollX + "px";
          list.style.width = rect.width + "px";
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
  frappe.after_ajax(() => {
    const checkNavbar = setInterval(() => {
      let $userDropdown = $(".navbar .dropdown-navbar-user");
      if ($userDropdown.length && !$("#theme-navbar-icon").length) {
        clearInterval(checkNavbar);
        console.log("Injecting theme icon near avatar...");
        let svgIcon = `
                <li id="theme-navbar-icon" class="nav-item" 
                    style="display:flex;align-items:center;cursor:pointer;margin-right:8px;">
                    <button class="btn-theme nav-item btn-reset nav-link" title="Theme Hub">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette-icon lucide-palette"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                    </button>
                </li>
            `;
        $userDropdown.before(svgIcon);
        $("#theme-navbar-icon").on("click", () => {
          frappe.set_route("themes");
        });
      }
    }, 300);
  });
})();
//# sourceMappingURL=customJs.bundle.6RYF6CSH.js.map
