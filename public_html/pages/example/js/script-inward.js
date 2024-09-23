var jpdbBaseURL = 'http://api.login2explore.com:5577';
var connToken = '90932176|-31949215765002474|90963961';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';

var itemDBName = 'Inventory_Management_DB';
var itemReceivedRelation = 'Items_Inward';

setBaseUrl(jpdbBaseURL);

function disableCtrl(ctrl) {
    $('#new').prop('disabled', ctrl);
    $('#save').prop('disabled', ctrl);
    $('#edit').prop('disabled', ctrl);
    $('#change').prop('disabled', ctrl);
    $('#reset').prop('disabled', ctrl);
}

function disableNav(ctrl) {
    $('#first').prop('disabled', ctrl);
    $('#prev').prop('disabled', ctrl);
    $('#next').prop('disabled', ctrl);
    $('#last').prop('disabled', ctrl);
}

function disableForm(bValue) {
    $('#receiptNo').prop('disabled', bValue);
    $('#receiptDate').prop('disabled', bValue);
    $('#itemid').prop('disabled', bValue);
    $('#itemName').prop('disabled', bValue);
    $('#quantity').prop('disabled', bValue);
}

function initItemForm() {
    localStorage.removeItem('first_rec_no');
    localStorage.removeItem('last_rec_no');
    localStorage.removeItem('rec_no');
    console.log("initItemForm() - done");
}

function makeDataFromEmpty() {
    $('#receiptNo').val('');
    $('#receiptDate').val('');
    $('#itemid').val('');
    $('#quantity').val('');
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return;
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, itemDBName, itemReceivedRelation);
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(putRequest, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (isNoRecordPresentLS()) {
        setFirstRecNo2LS(jsonObj);
    }
    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);
    resetForm();
}
function setCurrRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("rec_no", data.rec_no);
}

function getCurrRecNoFromLS() {
    return localStorage.getItem("rec_no");
}

function setFirstRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("first_rec_no", data.rec_no, "0");
}

function getFirstRecNoFromLS() {
    return localStorage.getItem("first_rec_no");
}

function setLastRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("last_rec_no", data.rec_no, "0");
}

function getLastRecNoFromLS() {
    return localStorage.getItem("last_rec_no");
}
function newForm() {
    makeDataFromEmpty();
    disableForm(false);
    $('#receiptNo').focus();
    disableNav(true);
    disableCtrl(true);

    $('#save').prop('disabled', false);
    $('#reset').prop('disabled', false);
}
function resetForm() {
    disableCtrl(true);
    disableForm(true);

    var getCurrRequest = createGET_BY_RECORDRequest(connToken, itemDBName, itemReceivedRelation, getCurrRecNoFromLS());
    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getCurrRequest, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({ async: true });

    if (isOnlyRecordPresentLS() || isNoRecordPresentLS()) {
        disableNav(true);
    }
    $('#new').prop('disabled', false);
    if (isNoRecordPresentLS()) {
        makeDataFromEmpty();
        $('#edit').prop('disabled', true);
    } else {
        $('#edit').prop('disabled', false);
    }
    disableForm(true);
}
// Validate data and return JSON string
function validateData() {
    var receiptNo = $("#receiptNo").val().trim();
    var receiptDate = $("#receiptDate").val().trim();
    var itemid = $("#itemid").val().trim();
    var quantity = $("#quantity").val().trim();

    $('#errorReceiptNo').text('');
    $('#errorItemId').text('');
    $('#errorQuantity').text('');

    if (receiptNo === '') {
        $('#errorReceiptNo').text("Receipt No is missing");
        $("#receiptNo").focus();
        return "";
    }
    if (!validateReceiptNo(receiptNo)) {
        $('#errorReceiptNo').text("Invalid Receipt Number format. Use YYYYMMDD-XXXXX.");
        $("#receiptNo").focus();
        return "";
    }
    if (receiptDate === '') {
        $('#errorReceiptNo').text("Receipt Date is missing");
        $("#receiptDate").focus();
        return "";
    }
    if (itemid === '') {
        $('#errorItemId').text("Item ID is missing");
        $("#itemid").focus();
        return "";
    }
    if (!validateItemID(itemid)) {
        $('#errorItemId').text("Item not present");
        $("#itemid").focus();
        return "";
    }
    if (quantity === '') {
        $('#errorQuantity').text("Quantity is missing");
        $("#quantity").focus();
        return "";
    }
    if (!/^\d+(\.\d{1,3})?$/.test(quantity)) {
        $('#errorQuantity').text("Quantity must be a number with up to 3 decimal places.");
        $("#quantity").focus();
        return "";
    }

    var jsonStrObj = {
        recipient_no: receiptNo,
        recipient_date: receiptDate,
        item_id: itemid,
        item_name: $('#itemName').val(),
        qty_recieved: quantity
    };
    return JSON.stringify(jsonStrObj);
}

function getFirst() {
    var getFirstRequest = createFIRST_RECORDRequest(connToken, itemDBName, itemReceivedRelation);
    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getFirstRequest, jpdbIRL);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({ async: true });
    $('#receiptNo').prop('disabled', true);
    $('#first').prop('disabled', true);
    $('#prev').prop('disabled', true);
    $('#next').prop('disabled', false);
    $('#save').prop('disabled', true);
}

function getPrev() {
    var r = getCurrRecNoFromLS();
    if (r === 1) {
        $('#first').prop('disabled', true);
        $('#prev').prop('disabled', true);
    }
    var getPrevRequest = createPREV_RECORDRequest(connToken, itemDBName, itemReceivedRelation, r);
    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getPrevRequest, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({ async: true });
    var r = getCurrRecNoFromLS();
    if (r === 1) {
        $('#prev').prop('disabled', true);
        $('#first').prop('disabled', true);
    }
    $('#save').prop('disabled', true);
}

function getNext() {
    var r = getCurrRecNoFromLS();

    var getPrevRequest = createNEXT_RECORDRequest(connToken, itemDBName, itemReceivedRelation, r);
    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getPrevRequest, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({ async: true });

    $('#save').prop('disabled', true);
}

function getLast() {
    var getLastRequest = createLAST_RECORDRequest(connToken, itemDBName, itemReceivedRelation);
    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getLastRequest, jpdbIRL);
    setLastRecNo2LS(result);
    showData(result);
    jQuery.ajaxSetup({ async: true });
    $('#receiptNo').prop("disabled", true);
    $('#first').prop("disabled", false);
    $('#prev').prop("disabled", false);
    $('#last').prop("disabled", true);
    $('#next').prop("disabled", true);
    $('#save').prop("disabled", true);
}
function editData() {
    disableForm(false);
    $('#receiptNo').prop('disabled', true);
    $('#receiptDate').focus();

    disableNav(true);
    disableCtrl(true);
    $('#change').prop('disabled', false);
    $('#reset').prop('disabled', false);
}

function changeData() {
    var jsonChg = validateData();
    if (jsonChg === '') {
        return;
    }
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, itemDBName, itemReceivedRelation, getCurrRecNoFromLS());

    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommandAtGivenBaseUrlV11(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log(jsonObj);
    resetForm();
    $('#receiptNo').focus();
    $('#edit').focus();
}

function showData(jsonObj) {
    if (jsonObj.status === 400) {
        return;
    }
    var data = JSON.parse(jsonObj.data).record;
    console.log(data);
    $('#receiptNo').val(data.recipient_no);
    $('#receiptDate').val(data.recipient_date);
    $('#itemid').val(data.item_id);
    // $('#itemName').val(data.item_name);
    $('#quantity').val(data.qty_recieved);
    disableNav(false);
    disableCtrl(false);
    disableForm(true);
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#new').prop('disabled', false);
    $('#edit').prop('disabled', false);
}

function fetchItemDetails() {
    var itemId = $('#itemid').val();
    if (!validateItemID(itemId)) {
        $('#errorItemId').text("Item ID not valid or not found");
        return;
    }

    var getRequest = createGET_BY_KEYRequest(connToken, itemDBName, itemRelationName, JSON.stringify({ item_id: itemId }));

    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getRequest, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    var data = JSON.parse(result.data);
    if (Array.isArray(data)) {
        $('#itemName').val(data[0].item_name || "Item Name Not Found");
    } else {
        $('#itemName').val(data.item_name || "Item Name Not Found");
    }
}

function validateReceiptNo(receiptNo) {
    return /^\d{8}-\d{5}$/.test(receiptNo); // Ensures format YYYYMMDD-XXXXX
}

function validateItemID() {
    var itemid = $('#itemid').val().trim();
    const itemNameContainer = $('#itemNameContainer');
    var itemNameInput = $('#itemName');
    var errorItemId = $('#errorItemId');
    errorItemId.text('');
    if (itemid === "") {
        itemNameContainer.hide();
        errorItemId.text("Item ID is required");
        $('#itemid').focus();
        return false;
    }
    var jsonStr = {
        item_id: itemid
    };

    var getRequest = createGET_BY_KEYRequest(connToken, itemDBName, itemReceivedRelation, JSON.stringify(jsonStr));

    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (jsonObj.status === 400) {
        // Item not found, show error and allow save for new item
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        errorItemId.text("Item not present");
        itemNameContainer.hide();
        return false;
    } else if (jsonObj.status === 200) {
        // Item found, display its details
        showData(jsonObj);
        itemNameContainer.show();
        errorItemId.text('');
        return true;
    }
    errorItemId.text("Item not present");
    itemNameContainer.hide();
    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    const itemNameContainer = document.getElementById("itemNameContainer");
    itemNameContainer.style.display = "none";
});

function loadReceiptDetails() {
    var receiptNo = $('#receiptNo').val().trim();
    if (receiptNo === '') return;

    var jsonStr = { recipient_no: receiptNo };
    var getRequest = createGET_BY_KEYRequest(connToken, itemDBName, itemReceivedRelation, JSON.stringify(jsonStr));

    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommandAtGivenBaseUrlV11(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    console.log("API Response:", jsonObj);

    if (jsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#edit').prop('disabled', true);
    } else if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        console.log("Parsed Data:", data);

        if (data) {
            // Convert the date from dd-MM-yyyy to yyyy-MM-dd
            var dateParts = data.recipient_date.split('-');
            var formattedDate = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0]; // yyyy-MM-dd
            $('#receiptDate').val(formattedDate);
            if (data.item_id) {
                $('#itemid').val(data.item_id);
                validateItemID();
                if (data.item_name) {
                    $('#itemName').val(data.item_name);
                } else {
                    $('#itemName').val('');
                    $('#errorItemName').text('Item name not found');
                }
            } else {
                $('#itemid').val('');
                $('#errorItemId').text('Item ID is required');
            }

            $('#quantity').val(data.qty_recieved || '');
        } else {
            $('#itemid').val('');
            $('#itemName').val('');
            $('#quantity').val('');
            $('#errorItemId').text('No data found for this receipt number');
        }
    }
}

function getItemFromReceiptNo() {
    var receiptNo = $('#receiptNo').val().trim();
    $('#errorReceiptNo').text('');

    if (receiptNo === '') {
        $('#errorReceiptNo').text('Receipt No is required');
        $('#receiptNo').focus();
        return;
    }

    var jsonStr = { recipient_no: receiptNo };
    var getRequest = createGET_BY_KEYRequest(connToken, itemDBName, itemReceivedRelation, JSON.stringify(jsonStr));

    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommandAtGivenBaseUrlV11(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 400) {
        // If receipt number doesn't exist, prompt user to enter details for a new receipt
        $('#save').prop('disabled', false);
        $('#edit').prop('disabled', true);
        $('#receiptDate').focus();
        $('#errorReceiptNo').text('New Receipt. Please enter the details.');
    } else if (jsonObj.status === 200) {
        // Load the existing receipt data into the form
        var data = JSON.parse(jsonObj.data).record;
        if (data) {
            $('#receiptDate').val(data.recipient_date || '');
            $('#itemid').val(data.item_id || '');
            $('#itemName').val(data.item_name || '');
            $('#quantity').val(data.qty_recieved || '');
            validateItemID();
        }
    }
}

function isNoRecordPresentLS() {
    if (localStorage.getItem("first_rec_no") === "0" && localStorage.getItem("last_rec_no") === "0") {
        return true;
    }
    return false;
}

function isOnlyRecordPresentLS() {
    if (localStorage.getItem("first_rec_no") === localStorage.getItem("last_rec_no")) {
        return true;
    }
    return false;
}



