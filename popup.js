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

        // Call the fetch function to get and display the response data
        fetchResponseData(widgetSrc);
      });

      const copyButton = document.getElementById("copyURLButton");
      copyButton.addEventListener("click", copyURLButton);
    });


    // Example function to fetch response data
    function fetchResponseData(widgetSrc) {
        // Replace with your actual fetch call
        fetch(widgetSrc)
            .then(response => {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    throw new Error("Response is not JSON");
                }
            })
            .then(data => {
                updateResponseTable(data);
            })
            .catch(error => console.error('Error fetching response:', error));
    }

    // Function to update the response table with fetched data
    function updateResponseTable(data) {
        const tableBody = document.querySelector('#responseResultsTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach(item => {
            const row = document.createElement('tr');
            const productCell = document.createElement('td');
            const errorCell = document.createElement('td');

            productCell.textContent = item.product;
            errorCell.textContent = item.error;

            row.appendChild(productCell);
            row.appendChild(errorCell);
            tableBody.appendChild(row);
        });
    }

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

    function isValidUsername(username) {
        const regex = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
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

    function updateErrorColumn() {
        const table = document.getElementById('paramsTable');
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const valueUsedCell = row.querySelector('td[data-param]');
            const errorCell = row.querySelector('td:last-child');
            const paramName = valueUsedCell.getAttribute('data-param');
            const paramValue = valueUsedCell.textContent.trim();

            if (!paramValue) {
                setCheckMarkCell(errorCell);
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
});

