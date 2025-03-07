console.log("Background script loaded");

// Ensure chrome.storage.local is available before using it
if (!chrome.storage || !chrome.storage.local) {
    console.error("chrome.storage.local is undefined!");
} else {
    console.log("chrome.storage.local is available.");
}

// Expected widget parameters
const templateWidgetURL = new URL("https://newvehicle.com/widgets/lib/finance-comparator-convert/?username=www.ivendimotors.com&quoteeUid=268E8202-338E-4B26-A6FE-74BCDAB0A357&class=Car&condition=used&vrm=CX17HHA&registrationDate=03/01/2021&capCode=VAAD12ENG3HPIM%20%20%20%20%20%20&capId=72946&cashPrice=16000&vatIncluded=true&vatQualifying=false&currentOdometerReading=12000&vehicleImageUrl=https%3A%2F%2Fmedia-psa.groupe-psa.com%2Fmedias%2Fdomain1%2Fmedia11848%2F2009228-r00lv2pybs-preview.jpg&cashDepositType=flatRate&cashDeposit=1000&term=48&annualDistance=10000&dateOnForecourt=&usePersistedOptions=false&origin=https%3A%2F%2Fsales-widget-demo.ivendi.co%2F&widgetId=iv-finance-widget");
