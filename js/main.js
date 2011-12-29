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

namespace('club');

/**
 * main
 */
club.MapaDelClub  = (function (){
       // tu constructor 
       function MapaDelClub() {
    	   this.map = null;
    	   this.user = null;
    	   
    	   //click
    	   this.position = null; 
    	   //ventana de datos
    	   this.infowindow = null;
    	   
    	   //lista de motos
    	   this.motos = [];
    	   //salidas
    	   this.salidas = [];
    	   //talleres
    	   this.talleres = [];
       };
       
       //extiende
       MapaDelClub.prototype = new utils.EventsWrapper();

       // Definimos metodos del prototype
       (function(p) {

            p.init = function(_map) {
            	this.map = _map;
            	
            	this.preguntarUser();
            	
            	this.loadMotos();
            	this.loadSalidas();
            	this.loadTalleres();
            	
            	this.crearMenu();

            	this.crearMenuMapa(_map);
            	
            };
            
            /**
             * menu de mapa
             */
            p.crearMenuMapa = function(map) {

            	var self = this;
            	
            	google.maps.event.addListener(map, 'click', function(ev) {
            		self.muestraInfo( ev.latLng, map );
            	});
            	
            	google.maps.event.addListener(map, 'rightclick', function(ev) {
            		self.muestraInfo( ev.latLng, map );
	          	});
            }
            
            p.muestraInfo = function(position, map) {
            	this.position = position;
            	
            	if(!this.infowindow) {
            		
            		//TODO: pasar esto a html
            		var contentString = '<div class="infoWn" ><div class="infoWnOpts">Opciones:</div><hr />'
            			+'<ul> '
            			+' <li><a href="#" onclick="agregarMotoLnk(this); return closeInfo(false);">Aca estoy yo!</a></li> '
            			+' <li><a href="#" onclick="agregarSalidaLnk(this); return closeInfo(false);">Sugerir este lugar para visitar</a></li> '
            			+' <li><a href="#" onclick="agregarTallerLnk(this); return closeInfo(false);">Agregar taller amigo</a></li> '
            			+'</ul> '
            			+'</div>'
            			
            		this. infowindow = new google.maps.InfoWindow({
            		    content: contentString
            		});
            	}
            	
            	this.infowindow.setPosition( position );
            	
            	this.infowindow.open( map );
            }

	   p.muestraInfoSalida= function(position, map, salida) {
	       
	       this.hideInfo();
            		
            		//TODO: pasar esto a html
            		var contentString = '<div class="infoWn" ><div class="infoWnOpts">'+salida.nombre+'</div><hr />'
	       + salida.descripcion + '<br /><br />'
            			+'<ul> '
            			+' <li><a href="#" onclick="if(confirm(\'Eliminar lugar?\')) {borraSalidaLnk(this, '+salida.id+'); return closeInfo(false);} else {return false;}">Borrar este lugar</a></li> '
            			+'</ul> '
            			+'</div>'
            			
            		this. infowindowSalida = new google.maps.InfoWindow({
            		    content: contentString
            		});
            	
            	
            	this.infowindowSalida.setPosition( position );
            	
            	this.infowindowSalida.open( map );
	   }

	   p.muestraInfoTaller = function(position, map, taller){
	       
	       this.hideInfo();
            		
            		//TODO: pasar esto a html
            		var contentString = '<div class="infoWn" ><div class="infoWnOpts">'+taller.nombre+'</div><hr />'
            			+'<ul> '
            			+' <li><a href="#" onclick="if(confirm(\'Eliminar taller?\')) {borraTallerLnk(this, '+taller.id+'); return closeInfo(false);} else {return false;}">Borrar este taller</a></li> '
            			+'</ul> '
            			+'</div>'
            			
            		this. infowindowTaller = new google.maps.InfoWindow({
            		    content: contentString
            		});
            	
            	
            	this.infowindowTaller.setPosition( position );
            	
            	this.infowindowTaller.open( map );
	   }
            
            /**
             * cierra info window
             */
            p.hideInfo = function() {
            	if(this.infowindow) {
          		this.infowindow.close();
            	}

		if(this.infowindowTaller) {
		    this.infowindowTaller.close();
		    this.infowindowTaller = null;
		}

		if(this.infowindowSalida) {
		    this.infowindowSalida.close();
		    this.infowindowSalida = null;
		}

            }
            
            /**
             * menu superior
             */
            p.crearMenu = function() {
            	
            	//header
            	
            	$('menu_canvas').update('');
            	
            	$('menu_canvas').insert(new Element('a',{'href':'http://clubguerrerogmx.freeforums.org/'}).update(' Volver al foro '));
            	$('menu_canvas').insert(new Element('span').update(' - ' ));
            	
            	if(this.user) {
            		$('menu_canvas').insert(new Element('span').update(' Usuario actual: ' ));
            		$('menu_canvas').insert(new Element('a',{ 'href':'#', 'onclick':'ingresarUser(this); return false;'}).update( this.user ));
            	} else {
            		$('menu_canvas').insert(new Element('a',{ 'href':'#', 'onclick':'ingresarUser(this); return false;'}).update( "usuario"));
            	}
            	
            }            
            
            /**
             * nombre de usuario
             * 
             */
            p.preguntarUser = function() {
            	
            	var  user = utils.getCookie('userforo')
            	
            	if(!user) {
            		user = this.setUser( prompt("¿Cual es tu usuario del foro?") );
                	
            	} 
            	
            	this.user = user;
            	 
            }
            
            /**
             * usuario del foro actual
             */
            p.setUser = function(user) {
            	if(user) {
            		utils.setCookie('userforo',user,7);
            		this.user = user;
            		
            	} else {
            		user = utils.getCookie('userforo')
            	}
            	
            	return user;
            	
            }
            
            /**
             * lista de motos
             * 
             */
            p.loadMotos = function() {
            	var self = this;
            	
            	new Ajax.Request('api.php', {
            		  method: 'get',
            		  parameters: {call: 'listaMotos'},
            		  
            		  onSuccess: function(response) {
            			  if(!response.responseJSON) {
               		    	 alert('Error al listar Moto');
               		    	 return;
               		     }
               		     
               		     if(response.responseJSON.error) {
               		    	 aler(response.responseJSON.error);
               		    	 return;
               		     }
               		     
               		   self.agregarMotos(response.responseJSON.lista);
            		  },
            		  onFailure:function(response) {
            		      alert('Error al cargar Motos');
            		  } 
            		});
            };
            
            /**
             * validacion simple antes de enviar datos (user, cordenada)
             */
            p.validarDatosDeEnvio = function(){
            	
            	if(!this.position) {
            		alert('Error al buscar posicion');
            		return false;
            	}
            	
            	if(!this.user) {
            		this.setUser( prompt("¿Cual es tu usuario del foro?") );
            		
            		if(!this.user) {
            			return false;
            		}
            	}
            	
            	return true;
            }
            
            /**
             * marca de moto
             */
            p.agregarMoto = function() {
            	var user = this.user;
            	
            	if(!this.validarDatosDeEnvio()){
            		return;
            	}
            	
            	var params = {call: 'setMoto', latLng:this.position.toUrlValue(), user:user };
            	var self = this;
            	
            	new Ajax.Request('api.php', {
            	  method: 'get',
          		  parameters: params,
          		 
          		  onSuccess: function(response) {
          			  //console.log(response);
          		     if(!response.responseJSON) {
          		    	 alert('Error al guardar Moto');
          		    	 return;
          		     }
          		     
          		     if(response.responseJSON.error) {
          		    	 aler(response.responseJSON.error);
          		    	 return;
          		     }
          		     
          		    alert('Ya estas en el mapa!');
          		      
          		    self.agregarMotos(response.responseJSON.lista);
          		  },
          		  onFailure:function(response) {
          		      alert('Error al guardar Moto');
          		  } 
          		});
            };
            
            /**
             * agrega la lista de motos como markers en el mapa
             */
            p.agregarMotos = function(lista) {
 
            	if(!lista || !lista.length) {
            		return; //nada
            	}
            	
            	var latlngbounds = new google.maps.LatLngBounds();
            	var self = this;
            	
            	var markers = [];
            	
            	lista.each(function(moto){
            		
            		if(self.motos[moto.id]) {            			
            			self.motos[moto.id].setMap(null);
            			self.motos[moto.id] = null;            			
            		} 
            		
            		var latLngArr = moto.latLng.split(',') 
            		
            		var myLatlng = new google.maps.LatLng(latLngArr[0],latLngArr[1]);
            		
            		var marker = new google.maps.Marker({
					      position: myLatlng, 
					      map: self.map, 
					      icon: 'img/icons/motorcycle.png',
					      title: moto.userforo
					  });
            		
            		markers.push(marker.length);
            			
            		self.motos[moto.id] = marker;
            		
            		latlngbounds.extend( myLatlng );
            		
            	});
            	
            	if(markers.length) {
            		this.map.setCenter(latlngbounds.getCenter());
                	this.map.fitBounds(latlngbounds);

                    if(this.map.getZoom() > 16) {
                    	this.map.setZoom(16);
                    }
                    
                    var markerCluster = new MarkerClusterer(this.map, markers);
            	}
            	
            	
            }
            
            /**
             * sugerencia de salidas
             */
            p.loadSalidas = function() {
            	var self = this;
            	
            	new Ajax.Request('api.php', {
            		  method: 'get',
            		  parameters: {call: 'listaSalidas'},
            		  
            		  onSuccess: function(response) {
            			  if(!response.responseJSON) {
               		    	 alert('Error al listar salidas');
               		    	 return;
               		     }
               		     
               		     if(response.responseJSON.error) {
               		    	 aler(response.responseJSON.error);
               		    	 return;
               		     }
               		     
               		   self.mostrarSalidas(response.responseJSON.lista);
            		  },
            		  onFailure:function(response) {
            		      alert('Error al cargar Motos');
            		  } 
            		});
            };
            
            /**
             * muestra las salidas en el mapa
             */
            p.mostrarSalidas = function(lista) {
            	if(!lista || !lista.length) {
            		return; //nada
            	}
            	
            	var self = this;
            	
            	lista.each(function(salida){
            		
            		if(self.salidas[salida.id]) {            			
            			self.salidas[salida.id].setMap(null);
            			self.salidas[salida.id] = null;            			
            		} 
            		
            		var latLngArr = salida.latLng.split(',') 
            		
            		var myLatlng = new google.maps.LatLng(latLngArr[0],latLngArr[1]);
            		
            		var marker = new google.maps.Marker({
					      position: myLatlng, 
					      map: self.map, 
					      icon: 'img/icons/information.png',
					      title: salida.nombre || salida.userforo
					  });
            		 
            		self.salidas[salida.id] = {
            				marker: marker,
            				data: salida
            		};

		                	
            	google.maps.event.addListener(marker, 'click', function(ev) {
            	    self.muestraInfoSalida( ev.latLng, self.map, salida );
            	});
            	
            	google.maps.event.addListener(marker, 'rightclick', function(ev) {
            	    self.muestraInfoSalida( ev.latLng, self.map, salida );
	          	});
            		
            		
            	});
            }
            
            /**
             * listaTaller y demas
             */
            p.loadTalleres = function() {
            	//cargo tallers
            	var self = this;
            	
            	new Ajax.Request('api.php', {
            		  method: 'get',
            		  parameters: {call: 'listaTaller'},
            		  
            		  onSuccess: function(response) {
            			  if(!response.responseJSON) {
               		    	 alert('Error al listar talleres');
               		    	 return;
               		     }
               		     
               		     if(response.responseJSON.error) {
               		    	 aler(response.responseJSON.error);
               		    	 return;
               		     }
               		     
               		   self.mostrarTalleres(response.responseJSON.lista);
            		  },
            		  onFailure:function(response) {
            		      alert('Error al cargar Motos');
            		  } 
            		});
            };
            
            /**
             * muestra los talleres en el mapa
             * 
             */
            p.mostrarTalleres = function(lista){
            	if(!lista || !lista.length) {
            		return; //nada
            	}
            	
            	var self = this;
            	
            	lista.each(function(taller){
            		
            		if(self.talleres[taller.id]) {            			
            			self.talleres[taller.id].setMap(null);
            			self.talleres[taller.id] = null;            			
            		} 
            		
            		var latLngArr = taller.latLng.split(',') 
            		
            		var myLatlng = new google.maps.LatLng(latLngArr[0],latLngArr[1]);
            		
            		var marker = new google.maps.Marker({
					      position: myLatlng, 
					      map: self.map, 
					      icon: 'img/icons/repair.png',
					      title: taller.nombre || taller.userforo
					  });
            		 
            		self.talleres[taller.id] = {
            				marker: marker,
            				data: taller
            		};

     	
            	google.maps.event.addListener(marker, 'click', function(ev) {
            	    self.muestraInfoTaller( ev.latLng, self.map, taller );
            	});
            	
            	google.maps.event.addListener(marker, 'rightclick', function(ev) {
            	    self.muestraInfoTaller( ev.latLng, self.map, taller );
	          	});
            		
            		
            	});
            };
            
            /**
             * sugerencia de taller amigo
             */
            p.agregarTaller = function(nombre) {
            	

            	if(!nombre || !this.validarDatosDeEnvio()){
            		return;
            	}
            	
            	var user = this.user;
            	 
            	var params = {call: 'setTaller', latLng:this.position.toUrlValue(), user:user, nombre:nombre };
            	var self = this;
            	
            	new Ajax.Request('api.php', {
            	  method: 'get',
          		  parameters: params,
          		 
          		  onSuccess: function(response) {
          			  //console.log(response);
          		     if(!response.responseJSON) {
          		    	 alert('Error al guardar Taller');
          		    	 return;
          		     }
          		     
          		     if(response.responseJSON.error) {
          		    	 alert(response.responseJSON.error);
          		    	 return;
          		     }
          		     
          		    alert('Taller agregado!');
          		      
          		    self.mostrarTalleres(response.responseJSON.lista);
          		  },
          		  onFailure:function(response) {
          		      alert('Error al guardar Moto');
          		  } 
          		});
            };

	   //borra el taller seleccionado
	   p.borraTaller = function(id){
	       var user = this.user;
            	 
               var params = {call: 'borrarTaller', user:user, id: id };
            	var self = this;

	       if(self.talleres[id]) {
		   self.talleres[id].marker.setMap( null );
	       }
	       
            	new Ajax.Request('api.php', {
            	  method: 'get',
          		  parameters: params,
          		 
          		  onSuccess: function(response) {
          			  //console.log(response);
          		     if(!response.responseJSON) {
          		    	 alert('Error al borrar Taller');
          		    	 return;
          		     }
          		     
          		     if(response.responseJSON.error) {
          		    	 alert(response.responseJSON.error);
          		    	 return;
          		     }
          		     
          		    alert('Taller borrardo!');

          		      self.loadTalleres();
          		  },
          		  onFailure:function(response) {
          		      alert('Error al guardar Moto');
          		  } 
          		});
	   }
            
            /**
             * sugerencia de salida
             */
            p.agregarSalida = function(nombre, desc) {

            	if(!nombre || !this.validarDatosDeEnvio()){
            		return;
            	}
            	            	
            	var user = this.user;
            	            	
            	var params = {call: 'setSalida', latLng:this.position.toUrlValue(), user:user, desc:desc, nombre:nombre };
            	var self = this;
            	
            	new Ajax.Request('api.php', {
            	  method: 'get',
          		  parameters: params,
          		 
          		  onSuccess: function(response) {
          			//  console.log(response);
          		     if(!response.responseJSON) {
          		    	 alert('Error al guardar Taller');
          		    	 return;
          		     }
          		     
          		     if(response.responseJSON.error) {
          		    	 alert(response.responseJSON.error);
          		    	 return;
          		     }
          		     
          		    alert('Lugar agregado!');
          		      
          		    self.mostrarSalidas(response.responseJSON.lista);
          		  },
          		  onFailure:function(response) {
          		      alert('Error al guardar Salida');
          		  } 
          		});
            };


	   
	   //borra el taller seleccionado
	   p.borraSalida = function(id){
	       var user = this.user;
            	 
               var params = {call: 'borrarSalida', user:user, id: id };
            	var self = this;

	       if(self.salidas[id]) {
		   self.salidas[id].marker.setMap( null );
	       }
	       
            	new Ajax.Request('api.php', {
            	  method: 'get',
          		  parameters: params,
          		 
          		  onSuccess: function(response) {
          			  //console.log(response);
          		     if(!response.responseJSON) {
          		    	 alert('Error al borrar Salida');
          		    	 return;
          		     }
          		     
          		     if(response.responseJSON.error) {
          		    	 aler(response.responseJSON.error);
          		    	 return;
          		     }
          		     
          		    alert('Lugar borrardo!');

          		      self.loadSalidas();
          		  },
          		  onFailure:function(response) {
          		      alert('Error al guardar Moto');
          		  } 
          		});
	   }


       })(MapaDelClub.prototype);

       return MapaDelClub;
})();