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

require_once 'lib/DB.php';

//datos
$db = new ClubDB();

$db->contarVisita();

?><html> 
<head> 
	<title>ClubGMX - Mapa</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>	
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
	
	<link rel="stylesheet" type="text/css" href="css/main.css" />
	
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true&indexing=false"></script>
	<script type="text/javascript" src="js/markerclusterer.js"></script>
	
	<script type="text/javascript" src="js/prototype.js"></script>
	
	<script type="text/javascript" src="js/utils.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	
	<script type="text/javascript">

	  //logica del mapa
	  var mapaDelClub = null;
		
	  function initialize() {
	    var latlng = new google.maps.LatLng(-34.592, -58.459);
	    var myOptions = {
	      zoom: 8,
	      center: latlng,

	      navigationControl: true,
	      mapTypeControl: true,
	      scaleControl: true,
	      
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    
	    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	    mapaDelClub = new club.MapaDelClub();

	    mapaDelClub.init(map);
	  }

	  //eventos
	  function ingresarUser(lnk) {
		  if(mapaDelClub) {
			  mapaDelClub.setUser(prompt('Usuario del foro:'));
		  	mapaDelClub.crearMenu();
		  }
	  }

	  //clicks del menu
	  
	  function agregarMotoLnk(lnk) {
		  if(mapaDelClub) {
			  mapaDelClub.agregarMoto();
		  }
	  }

	  function agregarTallerLnk(lnk) {
		  if(mapaDelClub) {
			  mapaDelClub.agregarTaller(prompt("Nombre del taller: "));
		  }
	  }

	  function agregarSalidaLnk(lnk) {
		  if(mapaDelClub) {
			  mapaDelClub.agregarSalida(prompt("Nombre del lugar: "), prompt("Descripcion del lugar: "));
		  }
	  }

function borraTallerLnk(lnk, id) {
  if(mapaDelClub) {
			  mapaDelClub.borraTaller( id );
		  }
}

function borraSalidaLnk(lnk, id) {
  if(mapaDelClub) {
			  mapaDelClub.borraSalida( id );
		  }
}

	  //dialogo de mapa
	  function closeInfo(mostrarMsg, msg) {

		  if(mapaDelClub) {
			  mapaDelClub.hideInfo();
		  }	

		  if(mostrarMsg){
			  if(!msg) {
				  msg = "..falta armar esa opcion..¿sugerencias?";
			  }

			  alert(msg);
			     
		  }

		  return false;
	  }
		  
		  
      google.maps.event.addDomListener(window, 'load', initialize);
	</script>
</head>
<body >
	<div id="menu_canvas"> .. aguarde ..</div>
  <div id="map_canvas" style="width:100%; height:96%"></div>
</body>
</html>