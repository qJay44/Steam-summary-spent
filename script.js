// ==UserScript==
// @name         Steam summary spent
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://store.steampowered.com/account/history/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Button styles
    const cssCustomDiv = {position: 'absolute', bottom: '25%', right:'1%', 'z-index': 3}
    const customDiv = document.createElement('div')
    const customDivStyle = customDiv.style

    Object.keys(cssCustomDiv).forEach(key => { customDivStyle[key] = cssCustomDiv[key]} )
    document.getElementsByClassName('content')[0].appendChild(customDiv)

    // Setup all stuff after page loaded
    window.addEventListener('load', () => {
        const button = document.createElement('button')
        button.innerHTML = 'Calculate'
        button.onclick = calculate
        customDiv.appendChild(button)

    })

    // NOTE: If got row with no values it will ingore it
    // NOTE: If there are different currencies the summary will be completely wrong
    function calculate() {
        function float(text) { return parseFloat(text.replace(',', '.')) }

        let summary = 0.0;

        const table = document.getElementsByClassName('wallet_history_table')[0];
        const offset = 2; // First two rows are just titles
        const currency = table.rows[offset].cells[4].innerHTML.split(' ')[1] || '';
        for (let i = offset; i < table.rows.length - 1; i++) {
            const cells = table.rows[i].cells;

            // Try to get the change or the total (as negative, since it means spent but allways represented as positive) or just ignore current row adding 0
            summary += float(cells[4].innerHTML) || -float(cells[3].innerHTML) || 0;
        }

        alert(`${summary.toFixed(2)} ${currency}`)
    }
})();
