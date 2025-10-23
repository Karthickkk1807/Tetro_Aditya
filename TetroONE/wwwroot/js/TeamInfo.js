$(document).ready(function () {
    Common.ajaxCall("GET", "/HumanResource/GetTeamInfo", { EmployeeId: null }, MyTeamGetSuccess, null);

    $(document).on('mouseenter', '.box, .Child', function () {
        let $box = $(this);
        let empId = $box.find('.emp-empID').text().trim();

        Common.ajaxCall("GET", "/HumanResource/GetTeamInfo", { EmployeeId: parseInt(empId) }, function (response) {
            if (response.status) {
                var data = JSON.parse(response.data);
                if (data[0][0] && (data[0][0].Type != null || data[0][0].Type != undefined)) {
                    let tooltipHtml = "";
                    data[0].forEach(entry => {
                        if (entry.Type && entry.Time) {
                            tooltipHtml += `<strong>${entry.Type}</strong> - (${entry.Time})<br>`;
                        }
                    });
                    if (!$box.data('bs.tooltip')) {
                        $box.tooltip({
                            trigger: 'manual',
                            placement: 'bottom',
                            html: true,
                            title: tooltipHtml
                        }).on('shown.bs.tooltip', function () {
                            $(this).next('.tooltip').find('.tooltip-inner').css({
                                'background-color': '#a3d9cd'
                            });
                        });
                    } else {
                        $box.attr('data-original-title', tooltipHtml);
                    }
                    $box.tooltip('show');
                } else {
                    let tooltipHtml = "No Mapped Availability";
                    if (!$box.data('bs.tooltip')) {
                        $box.tooltip({
                            trigger: 'manual',
                            placement: 'bottom',
                            html: true,
                            title: tooltipHtml
                        }).on('shown.bs.tooltip', function () {
                            $(this).next('.tooltip').find('.tooltip-inner').css({
                                'background-color': '#d9a3c6'
                            });
                        });
                    } else {
                        $box.attr('data-original-title', tooltipHtml);
                    }
                    $box.tooltip('show');
                }
            }
        }, null);
    });

    $(document).on('mouseleave', '.box, .Child', function () {
        $('[data-original-title]').tooltip('hide');
    });
});

function MyTeamGetSuccess(response) {
    if (response.status) {
        var data = JSON.parse(response.data);
        if (data[0].EmployeeId != null || data[0].EmployeeId != 0 || data[0].EmployeeId != undefined) {
            const map = {};
            const roots = [];
            const employees = data[0];

            $.each(employees, function (_, emp) {
                map[emp.EmployeeId] = { ...emp, children: [] };
            });

            $.each(map, function (_, emp) {
                if (emp.ReportingPersonId != null && map[emp.ReportingPersonId]) {
                    map[emp.ReportingPersonId].children.push(emp);
                } else {
                    roots.push(emp);
                }
            });

            $('#orgTreeContainer').empty().append(renderTree(roots));
            adjustConnectorLines(); // Important: call after rendering
        } else {
            $('#orgTreeContainer').empty().append('<div class="d-flex justify-content-center" style="font-size: 23px;"><img src="/assets/commonimages/nodata.svg" style="margin-right: 10px;">No records found</div>');
        }
    }
}

function renderTree(nodes, level = 0) {
    const wrapper = $('<ul>').addClass('tree');
    $.each(nodes, function (_, node) {
        const li = $('<li>').addClass(`level-${level}`);

        const imagePath = node.EmployeeImage && node.EmployeeImage.trim() !== ''
            ? node.EmployeeImage
            : '/assets/commonimages/user_icon.png';

        const hasChildren = node.children && node.children.length > 0;
        const boxClass = hasChildren ? 'box Child' : 'box';

        const box = $(`<div class="${boxClass}">
                <img src="${imagePath}" class="user-icon" />
                <div class="emp-name">${node.EmployeeName}</div>
                <div class="emp-dept">${node.DepartmentName || ''}</div>
                <div class="emp-empID d-none">${node.EmployeeId || ''}</div>
            </div>`);

        if (hasChildren) {
            const connector = $('<div class="connector-line"></div>');
            box.append(connector);
        }

        li.append(box);

        if (hasChildren) {
            li.append(renderTree(node.children, level + 1));
        }

        wrapper.append(li);
    });

    return wrapper;
}

function adjustConnectorLines() {
    $('.box.Child').each(function () {
        const boxHeight = $(this).outerHeight();
        $(this).find('.connector-line').css({
            top: boxHeight + 'px'
        });
    });
}