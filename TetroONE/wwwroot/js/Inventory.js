
Inventory = {
    toggleFieldForAttachment: function (fieldValue, fieldId, addFieldId, addFieldLabelId) {
        if (fieldValue != null) {
            $(fieldId).hide();
            $(addFieldId).show();
            $(addFieldLabelId).hide();
        } else {
            $(fieldId).show();
            $(addFieldId).hide();
            $(addFieldLabelId).show();
        }
    },

    toggleField: function (fieldValue, fieldId, addFieldId, addFieldLabelId) {
        if (fieldValue) {
            $(fieldId).val(fieldValue);
            $(addFieldId).show();
            $(addFieldLabelId).hide();
        } else {
            $(addFieldId).hide();
            $(addFieldLabelId).show();
        }
    },

    bindAttachments: function (attachments) {

        const ulElement = $('#ExistselectedFiles');
        $('#selectedFiles,#ExistselectedFiles').empty('');
        existFiles = [];
        formDataMultiple = new FormData();
        if (attachments && attachments.length > 0) {
            attachments.forEach(file => {
                if (file.AttachmentId) {
                    $('#AddAttachment').show();
                    const truncatedFileName = file.AttachmentFileName.length > 10 ? `${file.AttachmentFileName.substring(0, 10)}...` : file.AttachmentFileName;
                    const liElement = $('<li>');
                    const downloadLink = $('<a>').addClass('download-link')
                        .attr('href', file.AttachmentFilePath)
                        .attr('download', file.AttachmentFileName)
                        .html('<i class="fas fa-download"></i>');
                    const deleteButton = $(`<a src="${file.AttachmentFilePath}" AttachmentId="${file.AttachmentId}" id="deletefile">`)
                        .addClass('delete-buttonattach').html('<i class="fas fa-trash"></i>');
                    liElement.append($('<span>').text(truncatedFileName), downloadLink, deleteButton);
                    ulElement.append(liElement);
                    $('#AddAttachLable').hide();
                }
            });
        } else {
            $('#AddAttachment').hide();
            $('#AddAttachLable').show();
        }
    },
};