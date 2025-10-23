var companyDocumentId = 0;
var formDataMultiple = new FormData();
var existFiles = [];
var deletedFiles = [];
$(document).ready(function () {
    Common.bindDropDownParent('DocTypeId', 'FormCompanyDocument', 'CompanyDocType');

    Common.ajaxCall("GET", "/HumanResource/GetCompanyDocument", { CompanyDocumentId: null, }, getSuccess, null);

    //Common.inputMaxDateNotAllow('ActivatedOn');
    $('#SaveCompanyDocument').click(function () {
        if ($('#FormCompanyDocument').valid()) {
            getExistFiles();

            var activatedOn = $('#ActivatedOn').val();
            var activateddate = new Date(activatedOn);

            var expiredOn = $('#ExpiredDate').val();
            var expireddate = new Date(expiredOn);

            var objvalue = {
                CompanyDocumentId: companyDocumentId == 0 ? null : companyDocumentId,
                DocumentName: Common.parseStringValue('DocumentName'),
                DocTypeId: Common.parseInputValue('DocTypeId'),
                ActivatedOn: activateddate,
                ExpiredDate: expireddate,
                Description: Common.parseStringValue('Description'),
                existImagePath: $('#existImagePath').attr('href'),
            };
            var sel = $(`#selectedFiles li`).length;
            var exec = $(`#ExistselectedFiles li`).length;

            if (exec != 0 || sel != 0) {
                formDataMultiple.append("StaticDetails", JSON.stringify(objvalue));
                formDataMultiple.append("Exist", JSON.stringify(existFiles));
                formDataMultiple.append("DeletedFile", JSON.stringify(deletedFiles));

                $.ajax({
                    type: "POST",
                    url: "/HumanResource/InsertCompanyDocument",
                    data: formDataMultiple,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.status) {
                            Common.successMsg(response.message);
                            $("#CompanyDocumentCanvas").css("width", "0%");
                            $('#fadeinpage').removeClass('fadeoverlay');
                            formDataMultiple = new FormData();
                            Common.ajaxCall("GET", "/HumanResource/GetCompanyDocument", { CompanyDocumentId: null, }, getSuccess, null);
                        }
                        else {
                            Common.errorMsg(response.message);
                        }
                    },
                    error: function (response) {
                        Common.errorMsg(response.message);
                    }
                });
            } else {
                Common.warningMsg("Please choose a file.");
            }

        }

    });

    $('#AddCompanyDocument').click(function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#CompanyDocumentCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#CompanyDocumentCanvas").css("width", "50%");
        } else {
            $("#CompanyDocumentCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#CompanyDocumentCanvas #Header').text("Add CompanyDocument");
        Common.removevalidation('FormCompanyDocument');
        $('#SaveCompanyDocument').text('Save');
        companyDocumentId = 0;
        $('#selectedFiles,#ExistselectedFiles').empty("");
        $('#fileInput').prop('disabled', false);
    });

    $(document).on('click', '#DocumentTable .btn-edit', function () {
        var windowWidth = $(window).width();
        if (windowWidth <= 600) {
            $("#CompanyDocumentCanvas").css("width", "95%");
        } else if (windowWidth <= 992) {
            $("#CompanyDocumentCanvas").css("width", "50%");
        } else {
            $("#CompanyDocumentCanvas").css("width", "39%");
        }
        $('#fadeinpage').addClass('fadeoverlay');
        $('#CompanyDocumentCanvas #Header').text("CompanyDocument Info");
        Common.removevalidation('FormCompanyDocument');
        $('#SaveCompanyDocument').text('Update');
        $('#selectedFiles,#ExistselectedFiles').empty("");
        companyDocumentId = $(this).data('id');
        Common.ajaxCall("GET", "/HumanResource/GetCompanyDocument", { CompanyDocumentId: companyDocumentId, }, editSuccess, null);

    });
    $(document).on('click', '#DocumentTable .btn-delete', async function () {
        var response = await Common.askConfirmation();
        if (response == true) {
            var CompanyDocumentId = $(this).data('id');
            Common.ajaxCall("GET", "/HumanResource/DeleteCompanyDocument", { CompanyDocumentId: CompanyDocumentId }, SaveSuccess, null);
        }
    });

    $('#CloseCanvas').click(function () {
        $("#CompanyDocumentCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
    });

    //$('#ActivatedOn').on('change', function () {
    //    if (companyDocumentId == 0) {
    //        var activatedOn = $(this).val();
    //        var date = new Date(activatedOn);
    //        date.setDate(date.getDate() + 1);
    //        var expiredDate = date.toISOString().split('T')[0];
    //        //$('#ExpiredDate').attr('min', expiredDate);
    //        //$('#ExpiredDate').val(expiredDate);
    //    }
    //});

    $(document).on('click', '#existImagePath', function (e) {
        e.preventDefault();

        let path = $(this).attr('href'); 
        let fileName = $(this).find('i').data('id'); 
        if (path) {
            const link = document.createElement('a');
            link.href = encodeURI(path);
            link.download = fileName || ''; 
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });


    $(document).on('click', '#deletefile', function () {
        var listItem = $(this).closest('li');
        var fileText = listItem.find('span').text();
        var hrefValue = $('#existImagePath').attr('href');
        deletedFiles.push({
            AttachmentId: null,
            ModuleName: "Client",
            ModuleRefId: null,
            AttachmentFileName: fileText,
            AttachmentFilePath: hrefValue
        });
        $(listItem).remove();
        $('#fileInput').prop('disabled', false);
    });

});
 
function getSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        var CounterBox = Object.keys(data[0][0]);

        //$("#CounterTextBox1").text(CounterBox[0]);
        //$("#CounterTextBox2").text(CounterBox[1]);
        //$("#CounterTextBox3").text(CounterBox[2]);
        //$("#CounterTextBox4").text(CounterBox[3]);

        //$('#CounterValBox1').text(data[0][0][CounterBox[0]]);
        //$('#CounterValBox2').text(data[0][0][CounterBox[1]]);
        //$('#CounterValBox3').text(data[0][0][CounterBox[2]]);
        //$('#CounterValBox4').text(data[0][0][CounterBox[3]]);

        $("#CounterTextBox1").text('Total Documents');
        $("#CounterTextBox2").text('Total Doc Types');
        $("#CounterTextBox3").text('Yet to Expire');
        $("#CounterTextBox4").text('Expired');

        $('#CounterValBox1').text('92');
        $('#CounterValBox2').text('16');
        $('#CounterValBox3').text('42');
        $('#CounterValBox4').text('19');

        $('#ProductDynamic').html(`
    <div class="table-responsive">
		<table class="table table-rounded dataTable data-table table-striped tableResponsive" id="DocumentTable"></table>
	</div>
`);
        var columns = Common.bindColumn(data[1], ['CompanyDocumentId',"Status_Color"]);

        Common.bindTable('DocumentTable', data[1], columns, -1, "CompanyDocumentId", '350px', true, access);
    }
}

function editSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        Common.bindParentData(data[0], 'FormCompanyDocument');
        var truncatedFileName = data[0][0].DocumentFileName.length > 10 ? data[0][0].DocumentFileName.substring(0, 10) + '...' : data[0][0].DocumentFileName;
        $('#ExistselectedFiles').append(`<li><span>${truncatedFileName} </span>&nbsp;<a id="existImagePath" href="${data[0][0].DocumentFilePath}"><i class="fas fa-download" data-id="${data[0][0].DocumentFileName}"></i></a><a class="delete-button" id="deletefile"><i class="fas fa-trash"></i></a></li>`);

        if (truncatedFileName != "") {
            $('#fileInput').prop('disabled', true);
        } else {
            $('#fileInput').prop('disabled', false);
        }
    }
}

function SaveSuccess(response) {
    if (response.status) {
        Common.successMsg(response.message);
        $("#CompanyDocumentCanvas").css("width", "0%");
        $('#fadeinpage').removeClass('fadeoverlay');
        Common.ajaxCall("GET", "/HumanResource/GetCompanyDocument", { CompanyDocumentId: null, }, getSuccess, null);
    } else {
        Common.errorMsg(response.message);
    }
}




function getExistFiles() {

    var existitem = $('#ExistselectedFiles li');
    $.each(existitem, function (index, value) {

        var fileText = $(value).find('span').text();
        var attachmentid = parseInt($(value).find('.delete-buttonattach').attr('attachmentid'));
        var src = $(value).find('.delete-buttonattach').attr('src');
        var moduleRefId = $(value).find('.delete-buttonattach').attr('ModuleRefId');
        var hrefValue = $('#existImagePath').attr('href');

        existFiles.push({
            AttachmentId: attachmentid,
            ModuleName: "",
            ModuleRefId: parseInt(moduleRefId),
            AttachmentFileName: fileText,
            AttachmentFilePath: hrefValue
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const selectedFiles = document.getElementById('selectedFiles');
    selectedFiles.innerHTML = '';
    fileInput.addEventListener('change', (e) => {

        const files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            formDataMultiple.append('files[]', files[i]);
        }

        var sel = $(`#selectedFiles li`).length;
        var exec = $(`#ExistselectedFiles li`).length;

        if (exec == 0 && sel == 0) {
            if (files.length > 0) {
                preview.style.display = 'block';


                for (const file of files) {
                    const fileItem = document.createElement('li');
                    const fileName = document.createElement('span');
                    const downloadButton = document.createElement('button');
                    const deleteButton = document.createElement('button');
                    downloadButton.innerHTML = '<i class="fas fa-download"></i>';
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    downloadButton.className = 'download-button';
                    deleteButton.className = 'delete-button';
                    downloadButton.type = 'button';
                    deleteButton.type = 'button'; 

                    downloadButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const blob = new Blob([file]);
                        const blobURL = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobURL;
                        a.download = file.name;
                        a.click();
                        URL.revokeObjectURL(blobURL);
                    });

                    deleteButton.addEventListener('click', () => {
                        var itemName = $(fileItem).find('span').text();
                        var newFormData = new FormData();
                        $.each(formDataMultiple.getAll('files[]'), function (index, value) {
                            if (value.name !== itemName) {
                                newFormData.append('files[]', value);
                            }
                        });
                        formDataMultiple = newFormData;

                        fileItem.remove();
                    });

                    fileName.textContent = file.name.length > 10 ? file.name.substring(0, 11) + '...' : file.name;
                    fileItem.appendChild(fileName);
                    fileItem.appendChild(downloadButton);
                    fileItem.appendChild(deleteButton);
                    selectedFiles.appendChild(fileItem);
                }
            } else {
                preview.style.display = 'none';
            }
        }
    });
});
