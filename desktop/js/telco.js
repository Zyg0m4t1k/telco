
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */


$("#table_cmd").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});

$("body").delegate(".listCmdActionOn", 'click', function() {
    var type = $(this).attr('data-type');
    var el = $(this).closest('.' + type).find('.cmdAttr[data-l1key=configuration][data-l2key=action]');
    jeedom.cmd.getSelectModal({cmd: {type: 'action'}}, function(result) {
        el.value(result.human);
    });
});

 $('body').undelegate('.icone .iconeOn[data-l1key=chooseIcon]', 'click').delegate('.icone .iconeOn[data-l1key=chooseIcon]', 'click', function () {
    var mode = $(this).closest('.icone');
    chooseIcon(function (_icon) {
        mode.find('.iconeAttrOn[data-l2key=iconOn]').empty().append(_icon);
    });
});

 $('body').undelegate('.icone .iconeAttrOn[data-l2key=iconOn]', 'click').delegate('.icone .iconeAttrOn[data-l2key=iconOn]', 'click', function () {
    $(this).empty();
});


/*
 * Fonction pour l'ajout de commande, appellé automatiquement par plugin.template
 */
function addCmdToTable(_cmd) {
    if (!isset(_cmd)) {
        var _cmd = {configuration: {}};
    }
    if (!isset(_cmd.configuration)) {
        _cmd.configuration = {};
    }
    var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">';
    tr += '<td>';
    tr += '<span class="cmdAttr" data-l1key="id" style="display:none;"></span>';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="name" style="width : 140px;" placeholder="{{Nom}}">';
    tr += '</td>';
    tr += '<td>';
    tr += '<span class="type" type="' + init(_cmd.type) + '">' + jeedom.cmd.availableType() + '</span>';
    tr += '<span class="subType" subType="' + init(_cmd.subType) + '"></span>';
    tr += '</td>';
	tr += '<td class="action">';
	tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-type="' + _cmd.type + '" data-l2key="action"  style="margin-bottom : 5px;width : 80%; display : inline-block;">';
	tr += '<a class="btn btn-default btn-sm cursor listCmdActionOn" data-type="' + _cmd.type + '" data-input="action" style="margin-left : 5px;"><i class="fa fa-list-alt "></i></a>';
	tr += '<a class="iconeOn btn btn-default btn-sm" data-l1key="chooseIcon"><i class="fa fa-flag"></i> {{Icône}}</a>';
	tr += ' <span class="cmdAttr iconeAttrOn label label-info cursor"  data-l1key="configuration" data-l2key="iconOn"  style="font-size : 1em;" ></span>';
	tr += '</td>';	
	
	
    tr += '<td>';
    if (is_numeric(_cmd.id)) {
        tr += '<a class="btn btn-default btn-xs cmdAction expertModeVisible" data-action="configure"><i class="fa fa-cogs"></i></a> ';
        tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fa fa-rss"></i> {{Tester}}</a>';
    }
    tr += '<i class="fa fa-minus-circle pull-right cmdAction cursor" data-action="remove"></i>';
    tr += '</td>';
    tr += '</tr>';
    $('#table_cmd tbody').append(tr);
    $('#table_cmd tbody tr:last').setValues(_cmd, '.cmdAttr');
    if (isset(_cmd.type)) {
        $('#table_cmd tbody tr:last .cmdAttr[data-l1key=type]').value(init(_cmd.type));
    }
    jeedom.cmd.changeType($('#table_cmd tbody tr:last'), init(_cmd.subType));
}
