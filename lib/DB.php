<?php
/*
    Copyright 2011 upsidedownmind.net

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */ 

//config general
require_once 'config.php';

//dbo
require_once 'rb.php';

/**
 * acceso a la info guardada
 *  
 *
 */
class ClubDB {
	
	/**
	 * conecta a la base
	 * TODO: pasar a mysql
	 */
	function loadDB() {
		
		//$DATABASE declarada en config
		global $DATABASE;

		R::setup('mysql:host='.$DATABASE['host'].';dbname='.$DATABASE['db'],$DATABASE['user'],$DATABASE['pass']); 

	}
	 
	
	function  cuantasVisitas() {
	  //TODO: select SUM(cantidad) from contador;
	}
	
	function  contarVisita() {
	  //TODO: hacer
	}
	
	/**
	 * listado de motos
	 * @return array:
	 */
	function &listaDeMotos() {
	  	
	  $motos = &R::getAll('select * from motos');
	  return $motos;	   
        
	}
	
	/**
	 * lista de salidas sugeridas
	 * 
	 * @return array:
	 */
	function listaSalidas() {
	  return  R::getAll('select * from salidas');
	}
	
	/**
	 * lista de talleres amigos
	 * @return array:
	 */
	function listaTaller() {
	  return  R::getAll('select * from talleres');
	}
	
	/**
	 * guarda/sobreescribe posicion de moto
	 * 
	 * @param array $data
	 */
	function setMoto(&$data) {
		
		$user = $this->cleanData( $data['user'] );
		

		$moto = R::findOne('motos', ' userforo=?', array($user));

	  if(empty($moto)) {
	    $moto = R::dispense('motos');
	    $moto->userforo = $user;
	    $moto->latLng = $this->cleanData( $data['latLng'] )  ;

	  } else {
	    $moto->latLng = $this->cleanData( $data['latLng'] );
	  }

	R::store($moto);

		//refresco y regreso
		return $this->getMotoByUser($user);
	}
	
	/**
	 * sugerencia de taller
	 * 
	 * @param array $data
	 */
	function setTaller(&$data, &$motoArr) {

	  $moto = &$this->getMoto($motoArr['id']);

	  if(empty($moto)){
	    return null;
	  }
	  
	  $taller = R::dispense('talleres');
	  $taller->userforo = $moto;
	  $taller->nombre = $this->cleanData( $data['nombre'] );
	  $taller->latLng = $this->cleanData( $data['latLng'] )  ;

	  R::store($taller);

	    return $taller->export();
	}
	
	/**
	* sugerencia de salida
	*
	* @param array $data
	*/
	function setSalida(&$data, &$motoArr) {

	  $moto = &$this->getMoto($motoArr['id']);

	  if(empty($moto)){
	    return null;
	  }
	  
	  $salida = R::dispense('salidas');
	  $salida->userforo = $moto;
	  $salida->nombre = $this->cleanData( $data['nombre'] );
	  $salida->latLng = $this->cleanData( $data['latLng'] );
	  $salida->descripcion = $this->cleanData( $data['desc'] );
	  

	  R::store($salida);

	  return $salida->export();
	}
	
	/**
	 * la moto con el ID especificado
	 * @param int $id
	 */
	private function getMoto($id) {
	  
	  $moto = &R::load('motos', $id);

	  if(!$moto->id){
	    return null;
	  }

	  return $moto;
	}

	/**
	 * el user del foro
	 * 
	 * @param string $user
	 */
	function getMotoByUser($user) {

	  $moto = R::findOne('motos', ' userforo=?', array($user));

	  if(empty($moto)) {
	    return $moto;
	  }

	  return $moto->export();
	}

	/**
	 * borra el taller del mapa
	 */
	function borrarTaller($id, $motoArr) {
	  
	  $taller = R::load('talleres', $id);

	  if($taller->id){

	    R::trash( $taller );

	    return true;
	  }

	  return false;
	}


	/**
	 * borra la salida del mapa
	 */
	function borrarSalida($id, $motoArr) {

	  $salida = R::load('salidas', $id);

	  if($salida->id){

	    R::trash( $salida );

	    return true;
	  }

	  return false;
	}

	
	/**
	 * borra datos inseguros
	 * 
	 * Enter description here ...
	 * @param unknown_type $param
	 * @return mixed
	 */
	function cleanData($param) {
		return  preg_replace('[^0-9a-zA-Z \-_,\.]', '', is_null($param) ? '' : $param );
	}
	
}

?>
