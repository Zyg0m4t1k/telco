<?php

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

try {
    require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';
    include_file('core', 'authentification', 'php');

    if (!isConnect()) {
        throw new Exception(__('401 - Accès non autorisé', __FILE__));
    }
	
    if (init('action') == 'LaunchAction') {
		log::add('telco','debug', ' LaunchAction Ajax ');
        $telco = telco::LaunchAction(init('id'),init('cmd'));
		ajax::success();
    }
	
	if (init('action') == 'getTelco') {
		if (init('object_id') == '') {
			$object = jeeObject::byId($_SESSION['user']->getOptions('defaultDashboardObject'));
		} else {
			$object = jeeObject::byId(init('object_id'));
		}
		if (!is_object($object)) {
			$object = jeeObject::rootObject();
		}
		$return = array();
		$return['eqLogics'] = array();
		if (init('object_id') == '') {
			foreach (jeeObject::all() as $object) {
				foreach ($object->getEqLogic(true, false, 'telco') as $telco) {
					$return['eqLogics'][] = $telco->toHtml(init('version'));
				}
			}
		} else {
			foreach ($object->getEqLogic(true, false, 'telco') as $telco) {
				$return['eqLogics'][] = $telco->toHtml(init('version'));
			}
			foreach (jeeObject::buildTree($object) as $child) {
				$telcoss = $child->getEqLogic(true, false, 'telco');
				if (count($telcoss) > 0) {
					foreach ($telcoss as $telcos) {
						$return['eqLogics'][] = $telcos->toHtml(init('version'));
					}
				}
			}
		}
		ajax::success($return);
	}	


    throw new Exception(__('Aucune méthode correspondante à : ', __FILE__) . init('action'));
    /*     * *********Catch exeption*************** */
} catch (Exception $e) {
    ajax::error(displayExeption($e), $e->getCode());
}
?>
