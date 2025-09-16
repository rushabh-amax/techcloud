// from-tab sliding effect

document.addEventListener('DOMContentLoaded', function () {
  function initSlidingTabs(ul) {
    if (!ul || ul.dataset.slidingTabsInitialized) return;
    ul.dataset.slidingTabsInitialized = '1';
    ul.style.position = ul.style.position || 'relative';

    // create the highlight bar
    const bar = document.createElement('div');
    bar.className = 'sliding-tab-bar';
    Object.assign(bar.style, {
      position: 'absolute',
      bottom: '0',
      height: '4px',
      background: '#AFDDFF',
      borderRadius: '1em 1em 0em 0em',
      transition: 'transform 200ms ease, width 200ms ease',
      left: '0',
      width: '0',
      zIndex: '1',
      pointerEvents: 'none'
    });
    ul.appendChild(bar);
    console.log("tab active slideer insterd")

    const update = () => {
      const active =
        ul.querySelector('.nav-link.active') ||
        ul.querySelector('.nav-link');
      if (!active) return;
      const linkRect = active.getBoundingClientRect();
      const ulRect = ul.getBoundingClientRect();
      const left = linkRect.left - ulRect.left + ul.scrollLeft;
      bar.style.width = linkRect.width + 'px';
      bar.style.transform = `translateX(${left}px)`;
    };

    // update on clicks (wait for bootstrap to toggle .active)
    ul.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link');
      if (link && ul.contains(link)) {
        setTimeout(update, 150);
      }
    });

    // update on resize
    window.addEventListener('resize', update);

    // observe active class changes & DOM changes inside the tabs
    const mo = new MutationObserver(() => update());
    mo.observe(ul, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });

    // initial position
    setTimeout(update, 0);
  }

  function scanAndInit() {
    document.querySelectorAll('ul.form-tabs, ul.nav-tabs, #form-tabs').forEach(initSlidingTabs);
  }

  // initial scan
  scanAndInit();

  // ERPNext desk is SPA-like; watch for new forms/tabs injected later
  const bodyObserver = new MutationObserver(() => scanAndInit());
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  // also rescan after Bootstrap tab show (BS4/BS5 attribute variants)
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[data-toggle="tab"], a[data-bs-toggle="tab"]')) {
      setTimeout(scanAndInit, 200);
    }
  });
});


// 
document.addEventListener("DOMContentLoaded", function () {
  console.log("Awesomplete shift start");

  const observer = new MutationObserver(() => {
    // find focused input inside form-grid that has awesomplete
    const activeInput = document.querySelector(
      '.form-grid .awesomplete input:focus[aria-owns]'
    );

    if (activeInput) {
      const listId = activeInput.getAttribute("aria-owns");
      const list = document.getElementById(listId);

      if (list) {
        console.log("Focused input:", activeInput.dataset.fieldname, activeInput);
        console.log("Dropdown list:", listId, list);

        // move list to <body> so it's not clipped by table/grid
        if (!list.dataset.shifted) {
          list.dataset.shifted = "1"; 
          document.body.appendChild(list);

          // reset base styles
          list.style.position = "absolute";
          list.style.background= "white";
          list.style.width="350px"
          list.style.border="1.4px solid whitesmoke"
          list.style.zIndex = "9999"; // ensure it's above form
          list.hidden = false;
        }

        // always recalc position relative to input
        const rect = activeInput.getBoundingClientRect();
        list.style.top = rect.bottom + window.scrollY + "px";
        list.style.left = rect.left + window.scrollX + "px";
        list.style.width = rect.width + "px";
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

