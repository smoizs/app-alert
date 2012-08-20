/*! 
 * The appalert Plugin
 * The plugin attempts to mimic the alert function of javasript and provide similar functionalities to native javascript modals.
 * version 1.0, Aug 07th, 2012
 * Copyright (c) 2012 Moiz Sitabkhan ( @smoizs )
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 * http://www.gnu.org/licenses/gpl-2.0.html
*/
(function($) {
    $.appalert = function(options, element) {
		//Global variables
		var APPC = get_cookie('__appAlertValue').toString();
		document.cookie='__appAlertValue = '+(parseInt(APPC)+1).toString();
		
		var aHeight = $(document).height();
		var aWidth = $(document).width();
        // plugin's default options
        var defaults = {
            'title'			: 	'',
			'message'		:	'',			// the message value to be added to the dialog
			'confirm'		:	false, 		// Ok and Cancel buttons
			'input'			:	false, 		// Text input (can be true or string for default text)
			'input_placeholder' : '',
			'animate'		:	false,		// Groovy animation
			'animateSpeed'	:	'normal',		
			'textOk'		:	'Ok',		// Ok button default text
			'textCancel'	:	'Cancel',	// Cancel button default text
			'overlay'		:	true, 		// Do you want to add an overlay in the background ?
			'applybuttons'	: 	true,		// Do you want to apply buttons.
			'timeout'		: 	5000,
			'width'			: 	0,
			//callback method
            onSuccess: function(callbackVal) {
				return callbackVal;
			}
        }
        var plugin = this;
        plugin.settings = {}
		plugin.aText = '';
		
        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
             element = element;        // reference to the actual DOM element
		plugin.init = function() {
            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);
			//create the primary element to hold the appalert
            $('<div/>').addClass('__appOuter').attr('id','a-Window-'+APPC).prependTo('body');
			
			// if a overlay is required, apply the overlay effect to block the GUI elements.
			if(plugin.settings.overlay) { 
				$('<div/>').attr('id','a-Overlay-'+APPC).addClass('__appOverlay').css('height', aHeight).css('width', aWidth).fadeIn(100).prependTo('body');
			}
			//add the inner container to hold the elements of the appalert dialog
			$('<div/>').addClass('__appInner').attr('id','a-WindowInner-'+APPC).appendTo('#a-Window-'+APPC);
			//if appalert was binded to a DOM element, use the html of that element and overide the message value.
			if($element.html()!=null) { 
				$('#a-WindowInner-'+APPC).html($element.html());
				//here we set the width of the outer window to the width of the element
				$('#a-Window-'+APPC).css({'min-width':$element.width()+'px'});
				$element.hide();
			} else {
				var contents = '';
				if(plugin.settings.title!='') { contents += '<h2>'+plugin.settings.title+'</h2>'; }
				if(plugin.settings.width>0) { contents += '<div style="width:'+plugin.settings.width+'px;">'+plugin.settings.message+'</div>'; } else { contents += plugin.settings.message; }
				$('#a-WindowInner-'+APPC).html(contents);
			}
			// position the appalert primary container to be in the center of the screen.
			$('#a-Window-'+APPC).css({'left':((($(window).width() - $('#a-Window-'+APPC).width())/ 2)+$(window).scrollLeft()) + 'px'});
			$('#a-Overlay-'+APPC+', #a-Window-'+APPC).show();	
			//If animate setting has been enabled, use the effect.
			if(plugin.settings.animate) {
				var asTime;
				if(isNaN(plugin.settings.animateSpeed)) { 
					switch(plugin.settings.animateSpeed) {
						case "slow":
						  asTime = 800;
						  break;
						  case "normal":
						  asTime = 500;
						  break;
						  case "fast":
						  asTime = 300;
						  break;
						  default:
						  asTime = 500;	
					}
				} else if(plugin.settings.animateSpeed=='') {
					asTime = 500;
				} else {
					asTime = plugin.settings.animateSpeed;
				}
				$('#a-Window-'+APPC).css('top', '-200px').show().animate({top:"100px"}, asTime);
			} else {
				$('#a-Window-'+APPC).css('top', '100px').fadeIn(100);	
			}
			// if the input paramerter has been enabled, create the appalert dialog as an input prompt
			if(plugin.settings.input) {
				if(typeof(plugin.settings.input)=='string') {
					$('<div/>').addClass('__appInput').html('<input type="text" class="__appTextbox" id="a-Textbox-'+APPC+'" value="'+plugin.settings.input+'" placeholder="'+plugin.settings.input_placeholder+'" />').appendTo('#a-WindowInner-'+APPC);
				} else {
					$('<div/>').addClass('__appInput').html('<input type="text" class="__appTextbox" id="a-Textbox-'+APPC+'" placeholder="'+plugin.settings.input_placeholder+'" />').appendTo('#a-WindowInner-'+APPC);	
				}
				$('#a-Textbox-'+APPC).focus();
			}
			if(plugin.settings.applybuttons) { 
				//Add the default Button container to the appalert Dialog after all the other elements have been added.
				$('<div />').addClass('__appButtons').attr('id','a-Buttons-'+APPC).appendTo('#a-WindowInner-'+APPC);
				//Add appropriate buttons
				if(plugin.settings) {
					$('#a-Buttons-'+APPC).append('<button value="ok" rel="'+APPC+'">'+plugin.settings.textOk+'</button>')
					if(plugin.settings.confirm || plugin.settings.input) {
						$('#a-Buttons-'+APPC).append('<button value="cancel" rel="'+APPC+'">'+plugin.settings.textCancel+'</button>'); 	
					} 
				} 
			// bind the esc and enter key to the appalert Window. esc will mimic the cancel button and enter will output the Ok Button.
			// The callback value will also be depended on this.
				$(document).keydown(function(e)  {
					if($('#a-Overlay-'+APPC).is(':visible')) {
						if(e.keyCode == 13) { $('#a-Buttons-'+APPC+' > button[value="ok"]').click(); }
						if(e.keyCode == 27) { $('#a-Buttons-'+APPC+' > button[value="cancel"]').click(); }
					}
				});
			}
			// if an input parameter was enabled, use the text entered by the user and use that for the callback function.
			plugin.aText = $('#a-Textbox-'+APPC).val();
			if(!plugin.aText) { plugin.aText = false; }
			$('#a-Textbox-'+APPC).keyup(function() { 
				plugin.aText = $(this).val(); 
			});
			
			if(plugin.settings.applybuttons) { 
				// now bind the button in the alert to specific actions.
				// @see doButtonClicked()
				$('#a-Buttons-'+APPC+' > button').live('click',doButtonClicked);
				// function to handle the click of a button.
				function doButtonClicked() {
					$('#a-Overlay-'+$(this).attr('rel')+', #a-Window-'+$(this).attr('rel')).remove();
					var callbackVal = false;
					if($(this).attr('value')=='ok') {
						if(plugin.settings) {
							if(plugin.settings.input) { callbackVal = plugin.aText; } 
							else { callbackVal = true; }
						} else { callbackVal = false; }
					} else if($(this).attr('value')=='cancel') { callbackVal = false; }
					else { callbackVal = false; }
					//pass the result of the clicked button to the onSuccess function.
					plugin.settings.onSuccess(callbackVal);
				}
			} else {
				if(plugin.settings.timeout>0) {
					$('#a-Overlay-'+APPC+', #a-Window-'+APPC).delay(plugin.settings.timeout).fadeOut(1000);	
				}
			}
        }	
		// call the "constructor" method
        plugin.init();
    }

	function get_cookie(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++) {
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  	if (x==c_name) {
				return unescape(y);
			}
		}
		return '1';
	}
    // add the plugin to the jQuery.fn object
    $.fn.appalert = function(options) {
        // iterate through the DOM elements we are attaching the plugin to
		return this.each(function() {
            var i = $(this);
			    var plugin = new $.appalert(options,this);
                i.data('appalert', plugin);
        });
    }
})(jQuery);