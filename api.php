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

/*

este archivo es simplemente un 

*/

//no cache
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT\n");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
header("Cache-Control: private",false); // required for certain browsers 
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");


//api simple para guardar/listar los puntos del mapa
require_once 'lib/DB.php';

// array con la respuesta para Ajax
$resp = array(
	"error" => "",
	"lista" => array()
);

/**
 * DB con los datos
 * 
 * @var ClubDB
 */
$db = new ClubDB();

$db->loadDB();

//usuario actual
$motoDeUsuario = null;
if(!isset($_COOKIE['userforo'])) {
  // "Usuario invalido";
			
} else {
  $motoDeUsuario = &$db->getMotoByUser($_COOKIE['userforo']) ;
}


//obtengo la accion a seguir
switch ($_REQUEST['call']) {

case 'motoActual':
  if(empty($motoDeUsuario)) {
		     $resp['error']  = "Usuario invalido";
			
    } else {
      $resp['lista'] = array( $motoDeUsuario );
    }

  break;
	
	//carga marcadores de moto
	case 'listaMotos':
		$resp['lista'] = $db->listaDeMotos();
	break;
	
	//talleres
	case 'listaTaller':
		$resp['lista'] = $db->listaTaller();
		break;
		
	//salidas
	case 'listaSalidas':
		$resp['lista'] = $db->listaSalidas();
		break;
	
	//guarda cordenada de moto
	case 'setMoto':
		
		if(!isset($_REQUEST['user'])) {
			$resp['error']  = "Usuario invalido";
			
		} elseif(!isset($_REQUEST['latLng'])) {
			$resp['error']  = "Posicion invalida";
			
		} else { 
			$moto = &$db->setMoto($_REQUEST);
			
			if(!is_null($moto)) {
				$resp['lista'][0] = $moto;
			} 
		} 
		 
	break;
	
	//agrega taller
	case 'setTaller':
	
	  if( empty($motoDeUsuario) ) {
			$resp['error']  = "Usuario invalido";
				
		} elseif(!isset($_REQUEST['latLng'])) {
			$resp['error']  = "Posicion invalida";
				
	  } elseif(!isset($_REQUEST['nombre']) || empty($_REQUEST['nombre']) ) {
			$resp['error']  = "Nombre invalido";
				
		} else {
	    $taller = &$db->setTaller($_REQUEST, $motoDeUsuario);
			
			if(!is_null($taller)) {
			  $resp['lista'] = array( $taller);
			} else {
			  $resp['error'] = "Error al crear taller";
			}
			
		}
	
			
	break;

	//agrega salida
	case 'setSalida':
	
	  if( empty($motoDeUsuario) ) {
			$resp['error']  = "Usuario invalido";
				
		} elseif(!isset($_REQUEST['latLng'])) {
			$resp['error']  = "Posicion invalida";
				
		}  elseif(!isset($_REQUEST['nombre']) || empty($_REQUEST['nombre']) ) {
			$resp['error']  = "Nombre invalido";
				
		}  elseif(!isset($_REQUEST['desc']) || empty($_REQUEST['desc']) ) {
			$resp['error']  = "Descripcion invalida";
				
		} else { 
	    $salida = &$db->setSalida($_REQUEST, $motoDeUsuario);
				
			if(!empty($salida)) {
			  $resp['lista'] = array( $salida );
			} else {
			  $resp['error'] = "Error al crear salida";
			}
		}
	
	break;

case 'borrarSalida':
  if( empty($motoDeUsuario) ) {
			$resp['error']  = "Usuario invalido";
				
		} elseif(!isset($_REQUEST['id'])) {
			$resp['error']  = "Salida invalida";
				
		} else { 
    $db->borrarSalida($_REQUEST['id'], $motoDeUsuario);
				
			  $resp['error'] = "Salida eliminada";
			
		}
	
  break;

case 'borrarTaller':
  if( empty($motoDeUsuario) ) {
			$resp['error']  = "Usuario invalido";
				
		} elseif(!isset($_REQUEST['id'])) {
			$resp['error']  = "Taller invalido";
				
		} else { 
    $db->borrarTaller($_REQUEST['id'], $motoDeUsuario);
				
			  $resp['error'] = "Taller eliminado";
			
		}
  break;
	  
	//no se encotro accion
	default:
		$resp['error'] = 'Accion incorrecta';
	break;
}

//envio respuesta
header('Content-type: application/json');
echo json_encode($resp);
?>