/**
* @author Aijoona (http://blog.aijoona.com/)
* @param {String} path
* @param {Object} root
*/
function namespace(path, root) {
       // valor por defecto
       root = root || this;

       var
       parts = path.split("."),
       l = parts.length,
       leaf;

       for(i = 0; i < l; i++) {
               leaf = parts[i];

               if(!root[leaf]) {
                       root[leaf] = {};
               }

               root = root[leaf]
       }

       return root;
}

var utils = {};

utils.setCookie = function(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
};

utils.getCookie = function(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
	  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	  x=x.replace(/^\s+|\s+$/g,"");
	  if (x==c_name)
	    {
	    return unescape(y);
	    }
	  }
}

/**
 * utils generales
 */
utils.Events = {

               /**
                * Dispara un evento evName en el elemento
                * con id element_id
                * @param String element_id
                * @param String evName
                */
               fireByID : function(element_id, evName) {
                       Utils.fire($(element_id), evName);
               },

               fire : function(element, evName) {
                       if(Prototype.Browser.IE){
                               element.fireEvent('on'+evName);
                       } else {
                               var evt = document.createEvent('HTMLEvents');
                               evt.initEvent(evName, true, true);
                               element.dispatchEvent(evt);
                       }
               }
       }



/**
 * @author Aijoona (http://blog.aijoona.com/)
 * Clase de eventos
 */
utils.EventsWrapper  = (function (){
       // tu constructor 
       function EventsWrapper() {
                this.observers = {};
       };

       // Definimos metodos del prototype
       (function(p) {

               p.trigger = function(eventName, args) {
                       if(!eventName || !this.observers[eventName]) {
                               return;
                       }

                       this.observers[eventName].each(function(listener){
                               listener( args, eventName );
                       });
               };

               p.on = function(eventName, listener) {
                       (this.observers[eventName] = this.observers[eventName] || []).push(listener);
               };

       })(EventsWrapper.prototype);

       return EventsWrapper;
})();
 