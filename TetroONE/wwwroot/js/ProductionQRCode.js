var ProductionPlanId = 0;
var ProductionLogId = 0;
var PlantMappingId = 0;

$(document).ready(function () {

    $('#fadeinpage').removeClass('fadeoverlay');

    ProductionPlanId = new URLSearchParams(window.location.search).get('ProductionPlanId');
    PlantMappingId = new URLSearchParams(window.location.search).get('PlantMappingId');

    Common.ajaxCall("GET", "/ProductionQRCode/GetProductionLogDetailsMob", { ProductionPlanId: ProductionPlanId }, GetQRCodeSuccess, null);

    if (sessionStorage.getItem("QRCodeSaved") === "true") {
        $('#ProductionQRCodeModal').hide();
        $('.ThankYouContant').css('display', 'flex');
        $('.ThankYouContant').show();
    } else {
        $('#ProductionQRCodeModal').show();
        $('.ThankYouContant').hide();
        $('.ThankYouContant').css('display', 'none');
    }

    $('#BatchNo').val('BATCH/NO/003');
    $('#BatchDate').val('2025-11-17');
    $('#TotalWeight').val('290 KG');
    $('#Colour').val('14-0002 TCX');
    $('#Machine').val('JET-2');

    $(document).on('click', '#SaveProductionQRCode', async function () {
        var statusId = $(this).data("status");

        let message;
        if (statusId == 3) {
            message = "Are you sure you want to mark this production as Started?";
        } else if (statusId == 4) {
            message = "Are you sure you want to mark this production as Completed?";
        } else {
            message = `Confirm action: ${statusText}?`;
        }

        const response = await Common.askConfirmationforCancel(message);
        if (!response) {
            return false;
        }

        if ($("#FormProductionQRCode").valid()) {
            var objvalue = {};
            objvalue.ProductionPlanId = ProductionPlanId != 0 ? parseInt(ProductionPlanId) : null;
            objvalue.ProductionLogId = ProductionLogId != 0 ? parseInt(ProductionLogId) : null;
            objvalue.PlantId = parseInt(PlantMappingId);

            objvalue.ProcessTypeId = parseInt($('#Process').val());
            objvalue.Quantity = parseFloat($('#Quantity').val());
            objvalue.ProductionLogStatusId = parseInt(statusId);
            objvalue.Remarks = $('#Remark').val();

            Common.ajaxCall("POST", "/ProductionQRCode/InsertUpdateProductionLogMob", JSON.stringify(objvalue), function (response) {
                if (response.status) {
                    Common.successMsg(response.message);
                    $('#fadeinpage').addClass('fadeoverlay');
                    $("#FormProductionQRCode")[0].reset();

                    sessionStorage.setItem("QRCodeSaved", "true");

                    setTimeout(function () {
                        $('#fadeinpage').removeClass('fadeoverlay');
                        $('#ProductionQRCodeModal').hide();
                        $('.ThankYouContant').css('display', 'flex');
                        $('.ThankYouContant').show();
                    }, 2300);
                }
                else {
                    Common.errorMsg(response.message);
                }
            }, null);
        }
    });
});

function GetQRCodeSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);

        $('#BatchNo').val(data[0][0].ProductionNo);
        $('#BatchDate').val(data[0][0].ProductionDate);
        $('#TotalWeight').val(data[0][0].TotalWeight);
        $('#Colour').val(data[0][0].Color);
        $('#Machine').val(data[0][0].Machine);
        $('#Status').val(data[0][0].ProductionLogStatusId);

        $('#Quantity').val(data[1][0].Quantity);
        $('#Remark').val(data[2][0].Remarks);
        ProductionLogId = data[2][0].ProductionLogId;

        Common.bindDropDownSuccessProcessType(data[2], "Process");
    }
}

function bindDropDownSuccessProcessType(response, controlid) {

    if (response != null) {
        var dataValue = response;
        $('#' + controlid).empty();
        if (dataValue.length > 0) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];
            $('#' + controlid).append($('<option>', {
                value: '',
                text: '--Select--',
            }));
            $.each(dataValue, function (index, item) {
                $('#' + controlid).append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty],
                }));
            });
        } else {
            $('#' + controlid).append($('<option>', {
                value: '',
                text: '--Select--',
            }));
        }
    }
}