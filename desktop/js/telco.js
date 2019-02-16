
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


$('.eqLogicAction[data-action=addEquipement]').on('click', function () {	
    bootbox.confirm("<form id='infos' class='form-horizontal'><fieldset>\
        <div class='form-group'>\
          <label >Nom de l'équipement</label>\
          <input type='text' class='form-control' id='name' placeholder='Nom' ></input>\
        </div>\
        <div class='form-group'>\
		<select id='sel_type' class='form-control'>\
		  <option  value='multimedia'>{{ Multimedia }}</option>\
		   <option  value='custom'>{{ Personnalisée }}</option>\
		</select>\
		</div>\
      </fieldset></form>", 
	
	
	 function (result) {
		 if (result == false) {
			 return;
		 }
		if( !$('#name').val() ) {
			$('#div_alert').showAlert({message: '{{Il faut donner un nom à l\'équipement.}}', level: 'danger'});
			return;
		}

		jeedom.eqLogic.save({
			type: eqType,
			eqLogics: [{name: $('#name').val(),configuration: {'type':$('#sel_type').value()}}],
			error: function (error) {
				$('#div_alert').showAlert({message: error.message, level: 'danger'});
			},
			success: function (data) {
				modifyWithoutSave = false;
				var vars = getUrlVars();
				var url = 'index.php?';
				for (var i in vars) {
					if (i != 'id' && i != 'saveSuccessFull' && i != 'removeSuccessFull') {
						url += i + '=' + vars[i].replace('#', '') + '&';
					}
				}
				url += 'id=' + data.id + '&saveSuccessFull=1';
				if (document.location.toString().match('#')) {
					url += '#' + document.location.toString().split('#')[1];
				} 
				loadPage(url);
				modifyWithoutSave = false;
			}
		});			  
    });
});



$("body").delegate(".listCmdActionOn", 'click', function() {
	 var el = $(this).closest('.action').find('.cmdAttr[data-l1key=configuration][data-l2key=action]');
    jeedom.cmd.getSelectModal({cmd: {type: 'action'}}, function(result) {
        el.value(result.human);
		jeedom.cmd.displayActionOption(el.value(), '', function (html) {
			el.closest('.action').find('.actionOptions').html(html);
			taAutosize();
		});		
		
    });
});

$("body").delegate(".listAction", 'click', function () {
  var el = $(this).closest('.action').find('.cmdAttr[data-l1key=configuration][data-l2key=action]');
  jeedom.getSelectActionModal({}, function (result) {
        el.value(result.human);
		jeedom.cmd.displayActionOption(el.value(), '', function (html) {
			el.closest('.action').find('.actionOptions').html(html);
			taAutosize();
		});	
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

function saveEqLogic(_eqLogic) {
		jeedom.eqLogic.getCmd({
			id: _eqLogic.id,
			error: function (error) {
				$('#div_alert').showAlert({message: error.message, level: 'danger'});
			},
			success: function (data) {
				var i;
				for (i = 0; i < data.length; i++) { 
					data[i].configuration.options = $('.actionOptions[data-cmd_id=' + data[i].id +']').getValues('.expressionAttr')
					data[i].type = "action";
					data[i].subType = "other";
					jeedom.cmd.save({
						'cmd': data[i],
						error: function (error) {
							$('#div_alert').showAlert({message: error.message, level: 'danger'});
						}
					});						
				}
			}
		});	
		return _eqLogic;
	
}

function printEqLogic(_eqLogic) {
	
	if (!isset(_eqLogic)) {
		var _eqLogic = {configuration: {}};
	}
	 actionOptions = [];
	
	switch (_eqLogic.configuration.type) {
	   case "multimedia": 
		   $('#tab_custom').hide();
		   $('#table_cmd').show();	   
		   break;	
	   case "custom": 
		   $('#tab_custom').show();
		   $('#table_cmd').hide();	   
		   break;		   
		     
	}	
}

$('.cmdAction[data-action=addCmdMulti]').on('click', function () {
	modifyWithoutSave = true;
	addCmdToTable({});
	$('.cmd:last .cmdAttr[data-l1key=type]').trigger('change');
});


/*
 * Fonction pour l'ajout de commande, appellé automatiquement par plugin.template
 */


function addCmdToTable(_cmd ,_type) {
		if (!isset(_cmd)) {
			var _cmd = {configuration: {}};
		}
		if (!isset(_cmd.configuration)) {
			_cmd.configuration = {};
		}	
		if (!isset(_cmd.configuration.action)) {
			_cmd.configuration.action = {};
		}	
		
		if (!isset(_cmd.configuration.options)) {
			_cmd.configuration.options = {};
			
		}
		if (!isset(_cmd.configuration.options[0])) {
			_cmd.configuration.options[0] = {};
			
		}
		if (!isset(_cmd.configuration.options[0].options)) {
			_cmd.configuration.options[0].options = {};
			
		}		

	if (_cmd.configuration.type == "multimedia") {
		var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '" >';
		tr += '<td>';
		tr += '<span class="cmdAttr" data-l1key="id" style="display : none;"></span>';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="name" style="width : 140px;" placeholder="{{Nom}}">';
		tr += '</td>';
		tr += '<td class="action">';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-type="' + _cmd.type + '" data-l2key="action"  style="margin-bottom : 5px;width : 80%; display : inline-block;">';
		tr += '<a class="btn btn-success btn-sm listAction" data-type="action_alarm" title="{{Sélectionner un mot-clé}}"><i class="fa fa-tasks"></i></a>';
		tr += '<a class="btn btn-default btn-sm cursor listCmdActionOn" data-type="' + _cmd.type + '" data-input="action" style="margin-left : 5px;"><i class="fa fa-list-alt "></i></a>';
		tr += '<div class="col-lg-6 actionOptions" data-cmd_id="' + init(_cmd.id) + '">';
		tr += jeedom.cmd.displayActionOption(init(_cmd.configuration.action, ''), _cmd.configuration.options[0].options);
		tr += '</div>';		
		tr += '</td>';	
		tr += '<td>';
		if (is_numeric(_cmd.id)) {
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
		
		
	} else {
	

		var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">';
		tr += '<td class="name">';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="type" value="action" style="display:none">';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="subtype" value="other" style="display:none">';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="id" style="display:none">';
		tr += '<div class="row">';
		tr += '<div class="col-sm-4">';
		tr += '<a class="cmdAction btn btn-default btn-sm" data-l1key="chooseIcon"><i class="fa fa-flag"></i> Icone</a>';
		tr += '<span class="cmdAttr" data-l1key="display" data-l2key="icon" style="margin-left : 10px;"></span>';
		tr += '</div>';
		tr += '<div class="col-sm-8">';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="name">';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="type" value="custom" style="display:none" >';
		tr += '</div>';
		tr += '</div></span></td>';
		tr += '<td style="width : 180px;">';
		tr += '<span><input type="color" class="cmdAttr" data-l1key="configuration" data-l2key="color" value="#ffffff" />{{ Couleur}}<br/></span> <br/>';
		tr += '</td>';
		tr += '<td class="action">';
		tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-type="action" data-l2key="action"  style="margin-bottom : 5px;width : 80%; display : inline-block;">';
		tr += '<a class="btn btn-success btn-sm listAction" data-type="action_alarm" title="{{Sélectionner un mot-clé}}"><i class="fa fa-tasks"></i></a>';
		tr += '<a class="btn btn-default btn-sm cursor listCmdActionOn" data-type="action" data-input="action" style="margin-left : 5px;"><i class="fa fa-list-alt "></i></a>';
		tr += '<div class="col-lg-6 actionOptions" data-cmd_id="' + init(_cmd.id) + '">';
		tr += jeedom.cmd.displayActionOption(init(_cmd.configuration.action, ''), _cmd.configuration.options[0].options);
		tr += '</div>';
		tr += '</td>';
		tr += '<td>';
		tr += '<span><input type="checkbox" class="cmdAttr" data-l1key="isVisible" checked/> {{Afficher}}<br/></span>';
		tr += '</td>';
		tr += '<td>';
		if (is_numeric(_cmd.id)) {
			tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fa fa-rss"></i> {{Tester}}</a>';
		}
		tr += '<i class="fa fa-minus-circle pull-right cmdAction cursor" data-action="remove"></i></td>';
		tr += '</tr>';
		$('#table_custom tbody').append(tr);
		$('#table_custom tbody tr:last').setValues(_cmd, '.cmdAttr');
		jeedom.cmd.changeType($('#table_custom tbody tr:last'), init(_cmd.subType));
	}
}

