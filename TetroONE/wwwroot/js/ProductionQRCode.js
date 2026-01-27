var ProductionPlanId = 0;
var ProductionLogId = 0;
var PlantMappingId = 0;

$(document).ready(function () {

    $('#fadeinpage').removeClass('fadeoverlay');

    ProductionPlanId = new URLSearchParams(window.location.search).get('ProductionPlanId');
    PlantMappingId = new URLSearchParams(window.location.search).get('PlantMappingId');

    Common.ajaxCall("GET", "/ProductionQRCode/GetProductionLogDetailsMob", { ProductionPlanId: ProductionPlanId }, GetQRCodeSuccess, null);

    $('.processBtn').hide();

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
     
    $('#Quantity').on('input', function () {
        var quantityValue = parseFloat($(this).val().replace(/[^\d.]/g, ''));
        var totalWeightValue = parseFloat($('#TotalWeight').val().replace(/[^\d.]/g, ''));

        if (!isNaN(quantityValue) && !isNaN(totalWeightValue)) {
            if (quantityValue > totalWeightValue) {
                Common.warning('Quantity cannot be greater than Total Weight!');
                $(this).val(totalWeightValue);
            }
        }
    });
     
    $(document).on('change', '#Process', function () {
        $('.processBtn').hide();
        var selectedVal = $(this).val();

        if (selectedVal === '') {
            return;
        }
        var statusName = $('#Process option:selected').data('statusname');
        if (statusName === 'Started') {
            $('.processBtn[data-status="Started"]').show();
        } else {
            $('.processBtn[data-status="Finished"]').show();
        }
    });

    $(document).on('click', '#SaveProductionQRCode', async function () {
        var statusId = $(this).data("status");

        let message;
        if (statusId == 'Started') {
            message = "Are you sure you want to mark this production as Started?";
        } else if (statusId == 'Finished') {
            message = "Are you sure you want to mark this production as Finished?";
        } else {
            message = `Confirm action: ${statusText}?`;
        }

        const response = await Common.askConfirmationforCancel(message);
        if (!response) {
            return false;
        }

        if ($("#FormProductionQRCode").valid()) {
            var objvalue = {};

            const params = new URLSearchParams(window.location.search);
            const userId = params.get('UserId');

            objvalue.LoginUserId = parseInt(userId);
            objvalue.ProductionPlanId = ProductionPlanId != 0 ? parseInt(ProductionPlanId) : null;
            objvalue.ProductionLogId = ProductionLogId != 0 ? parseInt(ProductionLogId) : null;
            objvalue.PlantId = parseInt(PlantMappingId);

            objvalue.ProcessTypeId = parseInt($('#Process').val());
            objvalue.Quantity = parseFloat($('#Quantity').val());
            objvalue.ProductionLogStatusId = statusId == 'Started' ? parseInt(4) : statusId == 'Finished' ? parseInt(5) : 0;
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
        $('#TotalWeight').val(Number(data[0][0].TotalWeight).toFixed(3));
        $('#Colour').val(data[0][0].Color);

        $('#Machine').val(data[0][0].Machine);
        $('#Status').val(data[0][0].ProductionLogStatusId);

        //Common.bindDropDownSuccessProcessType(data[2], "Process");
        bindDropDownSuccessProcessType(data[2], "Process");

        const arr = data[1];
        const lastQuantity = arr?.[arr.length - 1]?.Quantity ?? null;
        const lastRemarks = arr?.[arr.length - 1]?.Remarks ?? null; 

        if (data[2] && data[2][0] && data[2][0].StatusName === "Started") {
            $('#Quantity').val('');
            $('#Remark').val(''); 
            ProductionLogId = null;
        } else {
            $('#Quantity').val(lastQuantity != null ? Number(lastQuantity).toFixed(3) : '');
            $('#Remark').val(lastRemarks);
            ProductionLogId = data[1][0].ProductionLogId;
        }
    }
}

function bindDropDownSuccessProcessType(response, controlid) {

    if (response != null) {
        var dataValue = response;
        var $ddl = $('#' + controlid);

        $ddl.empty();

        if (dataValue.length > 0 && response[0].ProcessTypeId != null) {
            var valueproperty = Object.keys(dataValue[0])[0];
            var textproperty = Object.keys(dataValue[0])[1];

            $.each(dataValue, function (index, item) {
                $ddl.append($('<option>', {
                    value: item[valueproperty],
                    text: item[textproperty]
                }).attr('data-StatusName', item.StatusName));
            });
        } else {
            $ddl.append($('<option>', {
                value: '',
                text: 'ProcessCompleted'
            }));
        }

        $ddl.prop('selectedIndex', 0).trigger('change');
    }
}