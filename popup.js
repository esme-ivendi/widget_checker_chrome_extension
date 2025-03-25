document.addEventListener("DOMContentLoaded", () => {
    let widgetSrc = ''; // Define widgetSrc in an accessible scope

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
        widgetSrc = results && results[0] ? results[0].result : "Error extracting widget.";
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

    document.getElementById("reloadFrame").addEventListener("click", () => {
        const newURL = buildNewURL(); // Get the new URL from buildNewURL function
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: (newURL) => {
                  const iframe = document.getElementById("iv-finance-widget"); // Adjust selector
                  if (iframe) {
                      iframe.src = newURL; // Reload the iframe with the new URL
                      console.log("Iframe reloaded with new URL:", newURL);
                      // Manually trigger a resize event or apply necessary styles
                      iframe.onload = () => {
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        iframe.style.height = iframeDocument.body.scrollHeight + 'px';
                      };
                  } else {
                      console.log("Iframe not found.");
                  }
                },
                args: [newURL]
            }, () => {
                // Rerun the validation functions and update the error column
                updateErrorColumn();
            });
        });
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
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const valueUsedCell = row.querySelector('td[data-param] input');
        const errorCell = row.querySelector('td:last-child');
        const paramName = valueUsedCell.getAttribute('data-param');
        const paramValue = valueUsedCell.value.trim();

        if (!paramValue) {
            setErrorCell(errorCell);
        } else {
            const isValidFunction = getValidationFunction(paramName);
            if (isValidFunction && !isValidFunction(paramValue)) {
                setErrorCell(errorCell);
            } else {
                setCheckMarkCell(errorCell);
            }
        }
    });
}

function buildNewURL() {
    const baseURL = "https://newvehicle.com/widgets/lib/finance-comparator-convert/";
    const params = new URLSearchParams();

    const table = document.getElementById('paramsTable');
    const inputs = table.querySelectorAll('tbody tr td[data-param] input');

    inputs.forEach(input => {
        const paramName = input.getAttribute('data-param');
        const paramValue = input.value.trim();
        if (paramValue) {
            params.append(paramName, paramValue);
        }
    });

    return `${baseURL}?${params.toString()}`;
}

function isValidUsername(username) {
    const regex = /^www\.[a-zA-Z0-9-]+\.(co\.uk|com|org|net)$/i;
    return regex.test(username);
}

function isValidQuoteeUid(quoteeUid) {
    const regex = /^[0-9A-Z]{32}$/i;
    return regex.test(quoteeUid);
}

function isValidClass(className) {
    const validClasses = ['car', 'lcv', 'motorbike'];
    return validClasses.includes(className.toLowerCase());
}

function isValidCondition(condition) {
    const validConditions = ['used', 'new'];
    return validConditions.includes(condition.toLowerCase());
}

function isValidVrm(vrm) {
  const regex = /[0-9A-Z]{7}/gi;
    return regex.test(vrm);

}

function isValidRegistrationDate(registrationDate) {
    const regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/g
    return regex.test(registrationDate);
}

  function isValidCashPrice(cashPrice) {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(cashPrice);
}

function isValidMileage(currentOdometerReading){
    const regex = /^\d+$/;
    return regex.test(currentOdometerReading);
}

function isValidCapCode(capCode) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(capCode);
}

function isValidCapId(capId) {
    const regex = /^\d+$/;
    return regex.test(capId);
}

function isValidBoolean(value) {
    return value === 'true' || value === 'false';
}

function isValidTerm(term) {
    const regex = /^(1[2-9]|[2-8][0-9]|9[0-9])$/;
    return regex.test(term);
}

function isValidCashDepositType(cashDepositType) {
    const validTypes = ['flatRate', 'percentageOfCashPrice'];
    return validTypes.includes(cashDepositType);
}

function isValidCashDeposit(cashDeposit) {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(cashDeposit);
}

function isValidAnnualDistance(annualDistance) {
    const regex = /^\d+$/;
    return regex.test(annualDistance);
}

function isValidDateOnForecourt(dateOnForecourt) {
    const regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    return regex.test(dateOnForecourt);
}

function setErrorCell(errorCell) {
    errorCell.innerHTML = '&#10008;'; // Cross mark
    errorCell.classList.add('cross');
}

function setCheckMarkCell(errorCell) {
    errorCell.innerHTML = '&#10004;'; // Check mark
    errorCell.classList.remove('cross');
}

function getValidationFunction(paramName) {
    const validationFunctions = {
        'username': isValidUsername,
        'quoteeUid': isValidQuoteeUid,
        'class': isValidClass,
        'condition': isValidCondition,
        'vrm': isValidVrm,
        'registrationDate': isValidRegistrationDate,
        'cashPrice': isValidCashPrice,
        'currentOdometerReading': isValidMileage,
        'capCode': isValidCapCode,
        'capId': isValidCapId,
        'vatIncluded': isValidBoolean,
        'vatQualifying': isValidBoolean,
        'excludeVatAsDeposit': isValidBoolean,
        'term': isValidTerm,
        'cashDepositType': isValidCashDepositType,
        'cashDeposit': isValidCashDeposit,
        'annualDistance': isValidAnnualDistance,
        'dateOnForecourt': isValidDateOnForecourt,
        'functional_consent': isValidBoolean,
        'analytical_consent': isValidBoolean,
        'marketing_consent': isValidBoolean
    };
    return validationFunctions[paramName];
}





