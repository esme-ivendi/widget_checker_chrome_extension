// console.log("Background script loaded");

// // Ensure chrome.storage.local is available before using it
// if (!chrome.storage || !chrome.storage.local) {
//     console.error("chrome.storage.local is undefined!");
// } else {
//     console.log("chrome.storage.local is available.");
}

// Expected widget parameters
// const templateWidgetURL = new URL("https://newvehicle.com/widgets/lib/finance-comparator-convert/?username=www.ivendimotors.com&quoteeUid=268E8202-338E-4B26-A6FE-74BCDAB0A357&class=Car&condition=used&vrm=CX17HHA&registrationDate=03/01/2021&capCode=VAAD12ENG3HPIM%20%20%20%20%20%20&capId=72946&cashPrice=16000&vatIncluded=true&vatQualifying=false&currentOdometerReading=12000&vehicleImageUrl=https%3A%2F%2Fmedia-psa.groupe-psa.com%2Fmedias%2Fdomain1%2Fmedia11848%2F2009228-r00lv2pybs-preview.jpg&cashDepositType=flatRate&cashDeposit=1000&term=48&annualDistance=10000&dateOnForecourt=&usePersistedOptions=false&origin=https%3A%2F%2Fsales-widget-demo.ivendi.co%2F&widgetId=iv-finance-widget");


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "validateWidget") {
//         console.log("Received widget URL:", message.src);
//         let widgetSrc = new URL(message.src);
//         let report = validateWidget(widgetSrc);

//         if (chrome.storage && chrome.storage.local) {
//             chrome.storage.local.set({ widgetReport: report }, () => {
//                 if (chrome.runtime.lastError) {
//                     console.error("Storage error:", chrome.runtime.lastError);
//                 } else {
//                     console.log("Widget validation result saved successfully.");
//                 }
//             });
//         }
//     }
// });

// // this code isn't working at the moment, the extension is just returning the implemented widget code
// function validateWidget(actualURL) {
//     let templateParams = new URLSearchParams(templateWidgetURL.search);
//     let actualParams = new URLSearchParams(actualURL.search);
//     let report = [];

//     templateParams.forEach((value, key) => {
//         if (!actualParams.has(key)) {
//             report.push(`❌ Missing parameter: ${key}`);
//         } else if (actualParams.get(key) !== value) {
//             report.push(`⚠️ Mismatch: ${key} (Expected: ${value}, Found: ${actualParams.get(key)})`);
//         }
//     });

//     actualParams.forEach((value, key) => {
//         if (!templateParams.has(key)) {
//             report.push(`🔹 Extra parameter found: ${key} = ${value}`);
//         }
//     });

//     return report.length > 0 ? report.join("\n") : "✅ Widget implementation matches the template.";
// }
