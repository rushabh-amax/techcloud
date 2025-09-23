// document.addEventListener("DOMContentLoaded", function () {
//     // Immediately hide if already in DOM
//     document.querySelectorAll('.modal[role="dialog"] .modal-title')
//         .forEach(el => {
//             if (el.textContent.trim() === "Switch Theme") {
//                 el.closest('.modal').style.display = "none";
//             }
//         });

//     // Observe DOM for future modals being added
//     const observer = new MutationObserver(mutations => {
//         mutations.forEach(mutation => {
//             mutation.addedNodes.forEach(node => {
//                 if (node.nodeType === 1 && node.matches('.modal')) {
//                     const title = node.querySelector('.modal-title');
//                     if (title && title.textContent.trim() === "Switch Theme") {
//                         node.style.display = "none"; // block
//                     }
//                 }
//             });
//         });
//     });

//     observer.observe(document.body, { childList: true, subtree: true });
// });
