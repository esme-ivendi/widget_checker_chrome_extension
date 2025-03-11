document.addEventListener("DOMContentLoaded", () => {
    // Query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) {
        document.getElementById("requestURL").textContent = "No active tab found.";
        return;
      }
      
      // Use chrome.scripting.executeScript to run a function in the active tab
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        // Inline function that runs in the page's context
        function: () => {
          const widget = document.getElementById("iv-finance-widget");
          if (widget) {
            // Return the src attribute from the widget iframe
            return widget.getAttribute("src");
          } else {
            return "Widget with id 'iv-finance-widget' not found.";
          }
        }
      }, (results) => {
        // results is an array with one object per frame in which the script was executed.
        const widgetSrc = results && results[0] ? results[0].result : "Error extracting widget.";
        document.getElementById("requestURL").textContent = widgetSrc;

        // Extract parameters from the URL and update the table
        const urlParams = new URLSearchParams(widgetSrc.split('?')[1]);
        urlParams.forEach((value, key) => {
          const paramElement = document.querySelector(`td[data-param="${key}"] input`);
          if (paramElement) {
            paramElement.value = value;
          }
        });

        // Check for empty 'value used' entries and update the 'Error ?' column
        updateErrorColumn();
      });

      const copyButton = document.getElementById("copyURLButton");
      copyButton.addEventListener("click", copyURLButton);
    });
  });

  function copyURLButton() {
    console.log("Hello from Button!")
    // Get the text field
    const outputElement = document.getElementById("requestURL");
    const textToCopy = outputElement.innerText || outputElement.textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Text copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy text:", err);
    });
  }

  function updateErrorColumn() {
    const table = document.getElementById('paramsTable');
    const rows = table.querySelectorAll('tbody tr:not(.optional)');

    rows.forEach(row => {
        const valueUsedCell = row.querySelector('td[data-param] input');
        const errorCell = row.querySelector('td:last-child');

        if (!valueUsedCell.value.trim()) {
            errorCell.innerHTML = '&#10008;'; // Cross mark
            errorCell.classList.add('cross');
        }
    });
  }