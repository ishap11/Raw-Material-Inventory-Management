var jpdbBaseURL = 'http://api.login2explore.com:5577';
var connToken = '90932176|-31949215765002474|90963961';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var itemDBName = 'Inventory_Management_DB';
var itemReceivedRelation = 'Item_Outward';

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
    $('#issueNo').prop('disabled', bValue);
    $('#issueDate').prop('disabled', bValue);
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
    $('#issueNo').val('');
    $('#issueDate').val('');
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
    $('#issueNo').focus();
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
function validateData() {
    var issueNo = $("#issueNo").val().trim();
    var issueDate = $("#issueDate").val().trim();
    var itemid = $("#itemId").val().trim();
    var quantity = $("#quantity").val().trim();

    $('#errorIssueNo').text('');
    $('#errorItemId').text('');
    $('#quantityError').text('');

    if (issueNo === '') {
        $('#errorIssueNo').text("Issue No is missing");
        $("#issueNo").focus();
        return "";
    }
    if (issueDate === '') {
        $('#errorIssueNo').text("Issue Date is missing");
        $("#issueDate").focus();
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
        $('#quantityError').text("Quantity is missing");
        $("#quantity").focus();
        return "";
    }
    if (!/^\d+(\.\d{1,3})?$/.test(quantity)) {
        $('#quantityError').text("Quantity must be a number with up to 3 decimal places.");
        $("#quantity").focus();
        return "";
    }

    var jsonStrObj = {
        issue_no: issueNo,
        issue_date: issueDate,
        item_id: itemid,
        issue_name: $('#itemName').val(),
        qty_issued: quantity
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
    $('#issueNo').prop('disabled', true);
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
    $('#issueNo').prop("disabled", true);
    $('#first').prop("disabled", false);
    $('#prev').prop("disabled", false);
    $('#last').prop("disabled", true);
    $('#next').prop("disabled", true);
    $('#save').prop("disabled", true);
}
function editData() {
    disableForm(false);
    $('#issueNo').prop('disabled', true);
    $('#issueDate').focus();

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
    $('#issueNo').focus();
    $('#edit').focus();
}

function showData(jsonObj) {
    if (jsonObj.status === 400) {
        return;
    }
    var data = JSON.parse(jsonObj.data).record;
    console.log(data);
    $('#issueNo').val(data.issue_no);
    $('#issueDate').val(data.issue_date);
    $('#itemid').val(data.item_id);
    $('#itemName').val(data.issue_name);
    $('#quantity').val(data.qty_issued);
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
    var itemid = $('#itemid').val();
    if (!validateItemID(itemid)) {
        $('#errorItemId').text("Item ID not valid or not found");
        return;
    }

    var getRequest = createGET_BY_KEYRequest(connToken, itemDBName, itemReceivedRelation, JSON.stringify({ item_id: itemid }));

    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getRequest, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    var data = JSON.parse(result.data);
    if (Array.isArray(data)) {
        $('#itemName').val(data[0].issue_name || "Item Name Not Found");
    } else {
        $('#itemName').val(data.issue_name || "Item Name Not Found");
    }
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
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        errorItemId.text("Item not present");
        itemNameContainer.hide();
        return false;
    } else if (jsonObj.status === 200) {
        showData(jsonObj);
        itemNameContainer.show();
        errorItemId.text(''); 
        return true;
    }
    errorItemId.text("Item not present");
    itemNameContainer.hide();
    return false;
}
// Call this function when the page loads to hide the item name input initially
document.addEventListener("DOMContentLoaded", function () {
    const itemNameContainer = document.getElementById("itemNameContainer");
    itemNameContainer.style.display = "none";
});

function getIssueNo() {
    var issueNo = $('#issueNo').val().trim();
    if (issueNo === '') return;

    var jsonStr = { issue_no: issueNo };
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
            // Ensure date is in the format yyyy-MM-dd
            if (data.issue_date) {
                var dateParts = data.issue_date.split('-');
                if (dateParts.length === 3) {
                    var formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`; // yyyy-MM-dd
                    $('#issueDate').val(formattedDate); 
                } else {
                    console.error("Unexpected date format:", data.issue_date);
                }
            }
            if (data.item_id) {
                $('#itemid').val(data.item_id);
                validateItemID(); 
        
                if (data.issue_name) {
                    $('#itemName').val(data.issue_name); 
                } else {
                    $('#itemName').val(''); 
                    $('#errorItemName').text('Item name not found');
                }
            } else {
                $('#itemid').val('');
                $('#errorItemId').text('Item ID is required'); 
            }
        
            $('#quantity').val(data.qty_issued || '');
        } else {
            $('#itemid').val('');
            $('#itemName').val('');
            $('#quantity').val('');
            $('#errorItemId').text('No data found for this receipt number'); 
        }
    }
}

function getItemFromIssueNo() {
    var issueNo = $('#issueNo').val().trim();
    $('#errorIssueNo').text(''); 

    if (issueNo === '') {
        $('#errorIssueNo').text('Issue No is required');
        $('#issueNo').focus();
        return;
    }

    var jsonStr = { issue_no: issueNo };
    var getRequest = createGET_BY_KEYRequest(connToken, itemDBName, itemReceivedRelation, JSON.stringify(jsonStr));

    console.log('API Request:', getRequest); 

    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommandAtGivenBaseUrlV11(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    console.log("API Response:", jsonObj); 

    if (jsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#edit').prop('disabled', true);
        $('#issueDate').focus();
        $('#errorIssueNo').text('Issue number not found. Enter new details.');
    } else if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        if (data) {
            $('#issueDate').val(data.issue_date || '');
            $('#itemid').val(data.item_id || '');
            $('#itemName').val(data.issue_name || '');
            $('#quantity').val(data.qty_issued || '');
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


