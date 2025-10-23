$(document).ready(function () {
    $(document).on('click', '#AddEInvoice', function () {
        $('#EInvoiceModal').modal('show');

        $("#EInvoiceTypeColumn").hide();
        $("#IRNColumn").hide();
        $("#DocumentDetailsColumn").hide();
        $("#CancelIRNOuterColumn").hide();
        $("#RejectDateColumn").hide();
        $("#EWaybillTypeColumn").hide();
        $("#EWBIRNColumn").hide();
        $("#EWBDDColumn").hide();
        $("#EWBCancelOuterColumn").hide();
        $("#GetEWBbyDateColumn").hide();
    });
    $(document).on('click', '#E-InvoiceClose', function () {
        $('#EInvoiceModal').modal('hide')
    });
    $(document).on('click', '.btn-edit', function () {
        /*$('#EInvoiceModal').modal('show')*/
    });

    $("#documentType").change(function () {
        var selectedValue = $(this).val();
        if ((selectedValue == "1")) {
            $('#EInvoiceTypeColumn').show();
            $('#EWaybillTypeColumn').hide();

            //$("#EInvoiceTypeColumn").hide();
            $("#IRNColumn").hide();
            $("#DocumentDetailsColumn").hide();
            $("#CancelIRNOuterColumn").hide();
            $("#RejectDateColumn").hide();
            $("#EWaybillTypeColumn").hide();
            $("#EWBIRNColumn").hide();
            $("#EWBDDColumn").hide();
            $("#EWBCancelOuterColumn").hide();
            $("#GetEWBbyDateColumn").hide();

            $('#btnCancelIRN').hide();
            $('#btnEIByIRN').hide();
            $('#btnRejectedIRN').hide();


            $('#btnEWBbyIRN').hide();
            $('#btnGetEWBbyEWBNumber').hide();
            $('#btnEWBCancel').hide();
        }
        else if ((selectedValue == "2")) {
            $('#EWaybillTypeColumn').show();
            $('#EInvoiceTypeColumn').hide();

            //$("#EInvoiceTypeColumn").hide();
            $("#IRNColumn").hide();
            $("#DocumentDetailsColumn").hide();
            $("#CancelIRNOuterColumn").hide();
            $("#RejectDateColumn").hide();
            //$("#EWaybillTypeColumn").hide();
            $("#EWBIRNColumn").hide();
            $("#EWBDDColumn").hide();
            $("#EWBCancelOuterColumn").hide();
            $("#GetEWBbyDateColumn").hide();

            $('#btnCancelIRN').hide();
            $('#btnEIByIRN').hide();
            $('#btnRejectedIRN').hide();

            $('#btnEWBbyIRN').hide();
            $('#btnGetEWBbyEWBNumber').hide();
            $('#btnEWBCancel').hide();
        }
        else if ((selectedValue == "0")) {
            $('#EWaybillTypeColumn').hide();
            $('#EWaybillTypeColumn').hide();

            $("#IRNColumn").hide();
            $("#DocumentDetailsColumn").hide();
            $("#CancelIRNOuterColumn").hide();
            $("#RejectDateColumn").hide();
            $("#EWBIRNColumn").hide();
            $("#EWBDDColumn").hide();
            $("#EWBCancelOuterColumn").hide();
            $("#GetEWBbyDateColumn").hide();

            $('#btnCancelIRN').hide();
            $('#btnEIByIRN').hide();
            $('#btnRejectedIRN').hide();

            $('#btnEWBbyIRN').hide();
            $('#btnGetEWBbyEWBNumber').hide();
            $('#btnEWBCancel').hide();
        }
    });
    $("#EInvoiceDrop").change(function () {
        var selectedValue = $(this).val();
        if ((selectedValue == "1")) {
            $('#IRNColumn').show();
            $('#DocumentDetailsColumn').hide();
            $('#CancelIRNOuterColumn').hide();


            $('#btnEIByIRN').show();
            $('#btnRejectedIRN').hide();
            $('#btnCancelIRN').hide();
        }
        else if ((selectedValue == "2")) {
            $('#DocumentDetailsColumn').show();
            $('#IRNColumn').hide();
            $('#CancelIRNOuterColumn').hide();;

            $('#btnRejectedIRN').show();
            $('#btnEIByIRN').hide();
            $('#btnCancelIRN').hide();
        }
        else if ((selectedValue == "3")) {
            $('#CancelIRNOuterColumn').show();
            $('#IRNColumn').show();
            $('#DocumentDetailsColumn').hide();

            $('#btnCancelIRN').show();
            $('#btnEIByIRN').hide();
            $('#btnRejectedIRN').hide();
        }
        //else if ((selectedValue == "0")) {
        //    $('#IRNColumn').hide();
        //    $('#DocumentDetailsColumn').hide();
        //    $('#CancelIRNOuterColumn').hide();
        //}
    });
    $("#EwayBillDrop").change(function () {
        var selectedValue = $(this).val();
        if ((selectedValue == "1")) {
            $('#EWBIRNColumn').show();
            $('#EWBDDColumn').hide();
            $('#EWBCancelOuterColumn').hide();

            $('#btnEWBbyIRN').show();
            $('#btnGetEWBbyEWBNumber').hide();
            $('#btnEWBCancel').hide();
        }
        else if ((selectedValue == "2")) {
            $('#EWBDDColumn').show();
            $('#EWBIRNColumn').hide();
            $('#EWBCancelOuterColumn').hide();

            $('#btnEWBbyIRN').hide();
            $('#btnGetEWBbyEWBNumber').show();
            $('#btnEWBCancel').hide();
        }
        else if ((selectedValue == "3")) {
            $('#EWBCancelOuterColumn').show();
            $('#EWBIRNColumn').show();
            $('#EWBDDColumn').hide();

            $('#btnEWBbyIRN').hide();
            $('#btnGetEWBbyEWBNumber').hide();
            $('#btnEWBCancel').show();
        }
        //else if ((selectedValue == "0")) {
        //    $('#EWBIRNColumn').hide();
        //    $('#EWBDDColumn').hide();
        //    $('#EWBCancelOuterColumn').hide();
        //}
    });

});

$('.AckNo').on('click', function () {
    window.open('/assets/previewpdf/E-Invoice.png', '_blank');
});

$('.EwbNo').on('click', function () {
    window.open('/assets/previewpdf/e-waybill.jpg', '_blank');
});