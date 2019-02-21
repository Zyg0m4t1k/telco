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

/* * ***************************Includes********************************* */

require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';


class telco extends eqLogic {
    /*     * *************************Attributs****************************** */
	
	public static $_widgetPossibility = array('custom' => true);



    /*     * ***********************Methode static*************************** */

	public static function LaunchAction($id,$cmd) {
		$eqLogic = eqLogic::byId($id);
		$cmd= $eqLogic->getCmd(null,$cmd);
		if (!is_object($cmd)) {
			return;
		}
		$action = $cmd->getConfiguration('action');
		$options = $cmd->getConfiguration('options')[0]['options'];
		try {
			scenarioExpression::createAndExec('action', $action, $options);
		} catch (Exception $e) {
			log::add('telco', 'error', __('Erreur lors de l\'éxecution de ', __FILE__) . $cmd . __('. Détails : ', __FILE__) . $e->getMessage());
		}		
		
		
	}

	public static function  AddCmd($cmds,$logs,$eqLogic) {
		foreach( $cmds as $index => $cmd ) {
			$Commande = $eqLogic->getCmd(null,$logs[$index]);
				if (!is_object($Commande))
				{
					$Commande = new telcoCmd();
					$Commande->setName($cmd);
					$Commande->setIsVisible(1);
					$Commande->setLogicalId($logs[$index]);
					$Commande->setEqLogic_id($eqLogic->id);
					$Commande->setType('action');
					$Commande->setSubType('other');
				}
				$Commande->setConfiguration('type','multimedia');
				$Commande->save();
	
			}
		
	}
    /*
     * Fonction exécutée automatiquement toutes les minutes par Jeedom
      public static function cron() {

      }
     */


    /*
     * Fonction exécutée automatiquement toutes les heures par Jeedom
      public static function cronHourly() {

      }
     */

    /*
     * Fonction exécutée automatiquement tous les jours par Jeedom
      public static function cronDayly() {

      }
     */



    /*     * *********************Méthodes d'instance************************* */

    public function preInsert() {
        
    }

    public function postInsert() {
        
    }

    public function preSave() {
		if ($this->getConfiguration("type") == "") {
			$this->setConfiguration("type","multimedia");
		}
        
    }

    public function postSave() {
        
    }

    public function preUpdate() {
        
    }

    public function postUpdate() {
		if ($this->getConfiguration("type") == "multimedia") {
			$cmd = array('poweroff','television','video','1','2','3','4','5','6','7','8','9','0','menu','up','info','left','share','right','exit','down','return','volume-up','volume-down','volume-off','ch+','ch-','backward','forward','play','stop','registered','pause');
			$logical = array('poweroff','television','video','un','deux','trois','quatre','cinq','six','sept','huit','neuf','zero','menu','up','info','left','share','right','exit','down','return','volume-up','volume-down','volume-off','canalUp','canalDown','backward','forward','play','stop','registered','pause');
			self::AddCmd($cmd,$logical,$this);
		}
		
        
    }

    public function preRemove() {
        
    }

    public function postRemove() {
        
    }


	public function toHtml($_version = 'dashboard') {
		
		$replace = $this->preToHtml($_version);
		if (!is_array($replace)) {
			return $replace;
		}
		
		$version = jeedom::versionAlias($_version);
		if ($this->getConfiguration("type") == "custom" ) {
			if ($this->getIsEnable()) {
				$cmd_html = '';
				foreach ($this->getCmd() as $cmd) {
					if ($cmd->getIsVisible()) {
							$cmd_template = getTemplate('core', $_version, 'custom_cmd', 'telco');
							($cmd->getDisplay('icon') != '') ? $icon = $cmd->getDisplay('icon') : $icon = $cmd->getName() ;
							$cmd_replace = array(
								'#id#' => $cmd->getId(),
								'#name#' => $cmd->getName(), //($cmd->getDisplay('icon') != '') ? $cmd->getDisplay('icon') : $cmd->getName(),
								'#dashicon#' => $icon, 
								'#color#' => $cmd->getConfiguration('color')
							);
							
							// Construction du HTML pour #cmd#
							$cmd_html .= template_replace($cmd_replace, $cmd_template);
					}
				}
				$replace['#cmd#'] = $cmd_html;			
			}
		}
		return template_replace($replace, getTemplate('core', $version, $this->getConfiguration("type"), 'telco'));
	}

 

    /*     * **********************Getteur Setteur*************************** */
}

class telcoCmd extends cmd {
    /*     * *************************Attributs****************************** */


    /*     * ***********************Methode static*************************** */


    /*     * *********************Methode d'instance************************* */

    /*
     * Non obligatoire permet de demander de ne pas supprimer les commandes même si elles ne sont pas dans la nouvelle configuration de l'équipement envoyé en JS
      public function dontRemoveCmd() {
      return true;
      }
     */

    public function execute($_options = array()) {
			$cmd = $this->getConfiguration('action');
			$options = $this->getConfiguration('options')[0]['options'];
			try {
				scenarioExpression::createAndExec('action', $cmd, $options);
			} catch (Exception $e) {
				log::add('telco', 'error', __('Erreur lors de l\'éxecution de ', __FILE__) . $cmd . __('. Détails : ', __FILE__) . $e->getMessage());
			}
    }

    /*     * **********************Getteur Setteur*************************** */
}

?>
