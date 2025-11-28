$(document).ready(function () {

    $('#fadeinpage').removeClass('fadeoverlay');
     
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

    $(document).on('click', '#SaveProductionQRCode', function () {

        $('#fadeinpage').addClass('fadeoverlay');
        Common.successMsg('Updated Production Log Successfully');
        $("#FormProductionQRCode")[0].reset();
         
        sessionStorage.setItem("QRCodeSaved", "true");

        setTimeout(function () {
            $('#fadeinpage').removeClass('fadeoverlay');
            $('#ProductionQRCodeModal').hide();
            $('.ThankYouContant').css('display', 'flex');
            $('.ThankYouContant').show();
        }, 2300);
    });
});
