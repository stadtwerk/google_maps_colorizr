/*
Name:       Google Maps Colorizr
Version:    0.0.2 (April 7 2011)
Author:     Marc Köster
Support:    http://stadtwerk.org

Licence:    Google Maps Colorizr is licensed under a Creative Commons 
            Attribution-Noncommercial 3.0 Unported License 
            (http://creativecommons.org/licenses/by-nc/3.0/).

            You are free:
                + to Share - to copy, distribute and transmit the work
                + to Remix - to adapt the work

            Under the following conditions:
                + Attribution. You must attribute the work in the manner specified by the author or licensor 
                  (but not in any way that suggests that they endorse you or your use of the work). 
                + Noncommercial. You may not use this work for commercial purposes. 

            + For any reuse or distribution, you must make clear to others the license terms of this work.
            + Any of the above conditions can be waived if you get permission from the copyright holder.
            + Nothing in this license impairs or restricts the author's moral rights.
*/
function googlemapcolorizer()
{
	var styles;
	var map;
	var index;
	var googleBaseValues;
	
	// initialise map and class
	this.init = function()
	{
		//initialise map
		var options = {
			mapTypeControlOptions: {
				mapTypeIds: [ 'Styled']
			},
			center: new google.maps.LatLng(54.32, 10.10),
			zoom: 4,
			mapTypeId: 'Styled'
        };
        
        var div = document.getElementById('map');
        this.map = new google.maps.Map(div, options);
        var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
        this.map.mapTypes.set('Styled', styledMapType);
		
		//initialise class
		this.setGoogleBaseValues();
		this.index = 0;
		this.styles=[];
		this.isValidColor = [];
		this.addEventHandler();
		this.appendItemDiv();
		this.writeCode();
		
	};
	
	this.addEventHandler = function()
	{
		copybutton = document.getElementById("copy");
		copybutton.onclick = this.copyToClipboard;
	};
	
	// sets the base saturation and lightness from google maps
	this.setGoogleBaseValues = function()
	{
		this.googleBaseValues = new Array();
		this.googleBaseValues[0] = new Array("water", 33, 70);
		this.googleBaseValues[1] = new Array("landscape.man_made", 27, 89);
		this.googleBaseValues[2] = new Array("landscape.natural", 26, 93);
		this.googleBaseValues[3] = new Array("poi.medical", 40, 83);
		this.googleBaseValues[4] = new Array("poi.school", 43, 77);
		this.googleBaseValues[5] = new Array("poi.place_of_worship", 4, 81);
		this.googleBaseValues[6] = new Array("poi.park", 37, 72);
		this.googleBaseValues[7] = new Array("road.highway", 100, 64);
		this.googleBaseValues[8] = new Array("road.arterial", 100, 77);
		this.googleBaseValues[9] = new Array("road.local", 100, 100);
	};
	
	//appends a new Style
	this.appendItemDiv = function()
	{
		document.getElementById("items").appendChild(this.getItemDiv());
		this.addStyle();
		this.index++;
	};
	
	//deletes a style
	this.deleteItemDiv = function(button)
	{
		var item = button.parentNode.parentNode;
		document.getElementById("items").removeChild(item);
		this.deleteStyle(parseInt(item.firstChild.value));
	};
	
		//when clicked on a drop down Item (with mouse)
	this.selectedDropDownItem = function(option)
	{
		var itemdiv = option.parentNode.parentNode.parentNode.parentNode;
		this.checkColor(itemdiv);
	};
	
	//when Changes a drop down list (with keyboard)
	this.selectedDropDown = function(option)
	{
		var itemdiv = option.parentNode.parentNode.parentNode;
		this.checkColor(itemdiv);
	};
	
	//when changed the color
	this.changedColor = function(input)
	{
		var itemdiv = input.parentNode.parentNode.parentNode;
		this.checkColor(itemdiv);
	};
	
	
	
	
	//adds a default style to style Array
	this.addStyle = function()
	{
		this.styles.push([])
		this.styles[this.index] = {
          featureType: 'water',
          elementType: 'all',
          stylers: [],
        };
	};
	
	//delete a style from style Array
	this.deleteStyle = function(id)
	{
		if(id < this.index-1)
		{
			this.changeHtmlIds(id);
		}
		this.styles.splice(id, 1);
		this.index--;
		this.renderStyle();
	};
	
	//changes the IDs of the HTML Style divs to be equal with Style Array IDs
	this.changeHtmlIds = function(deletedId)
	{
		console.log(deletedId+"\n");
		for(var i = deletedId+1; i < this.index; i++)
		{
			console.log(i+"\n");
			itemdiv = document.getElementById("item"+i.toString());
			hiddeninput = itemdiv.firstChild;
			itemdiv.setAttribute("id", "item"+(i-1));
			hiddeninput.setAttribute("value", i-1);
		}
	};
	
	//returns a new HTML Item Div
	this.getItemDiv = function()
	{
		value = '<input type="hidden" name="id" value="'+this.index+'">';
		value += '<div class="wrap">';
		value += '	<div class="left">featureTyp: </div>';
		value += '	<div class="right">';
		value += '		<select name="featureTyp" onkeyup="gmc.selectedDropDown(this)" >';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">water</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">landscape.man_made</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">landscape.natural</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">poi.medical</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">poi.school</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">poi.place_of_worship</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">poi.park</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">road.highway</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">road.arterial</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">road.local</option>';
		value += '		</select>';
		value += '	</div>';
		value += '</div>';
		value += '<div class="wrap">';
		value += '	<div class="left">elementType: </div>';
		value += '	<div class="right">';
		value += '		<select name="elementType">';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">all</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">geometry</option>';
		value += '			<option onclick="gmc.selectedDropDownItem(this)">labels</option>';
		value += '		</select>';
		value += '	</div>';
		value += '</div>';
		value += '<div class="wrap">';
		value += '	<div class="left">RGB Value: </div>';
		value += '	<div class="right"><input type="text" name="RGBValue" onchange="gmc.changedColor(this)"  onkeyup="gmc.changedColor(this)"/></div>';
		value += '</div>';
		value += '<div><input type="button" value="-" onclick="gmc.deleteItemDiv(this)"></div>';
		newItemDiv = document.createElement('div');
		newItemDiv.setAttribute('id',"item"+this.index);
		newItemDiv.setAttribute('class',"item");
		newItemDiv.innerHTML = value;
		return newItemDiv;
	};
	
	
	//checks if color is valid rgb
	this.checkColor = function(item)
	{
		var id = item.firstChild.value;
		var input = item.getElementsByTagName("input")[1];
		var color = input.value;
		
		if(color.substring(0,1) == "#")
			color = color.substring(1,color.length);
		if(!isNaN("0x"+color) && (color.length == 3 || color.length == 6)){
			this.isValidColor[id] = true;
			if(color.length ==3){
				color = color.substring(0,1)+color.substring(0,1)+color.substring(1,2)+color.substring(1,2)+color.substring(2,3)+color.substring(2,3);
			}
			input.className="";
			this.Calculate(item, color);
		}else{
			input.className="red";
			this.styles[id].stylers = [];
			if(this.isValidColor[id] == true)
				this.renderStyle();
			this.isValidColor[id] = false;
		}
	};

	//calculates HSL values and merge with google base values to get the real color and add them to style Array
	this.Calculate=function(item, color){
		var id = item.firstChild.value;
		var RGB = color;
		var featureType = item.getElementsByTagName("select")[0].value;
		var elementType = item.getElementsByTagName("select")[1].value;
		
		//calculate HSL values
		var R = parseInt(RGB.substring(0,2), 16)/255;
		var G = parseInt(RGB.substring(2,4), 16)/255;
		var B = parseInt(RGB.substring(4,6), 16)/255;

		var min = Math.min(Math.min(R, G), B);
		var max = Math.max(Math.max(R, G), B);
		var L = ((max+min)/2)*100;
		var S;
		if(min==max){
			S=0;
		}else{
			if(L<50){
				S = ((max-min)/(max+min))*100;
			}else{
				S = ((max-min)/(2-max-min))*100;
			}
		}
		
		//get base values
		for (var i=0, item; item=this.googleBaseValues[i]; i++) {
		   if (this.googleBaseValues[i][0] == featureType) {
			 var Lbase = this.googleBaseValues[i][2];
			 var Sbase = this.googleBaseValues[i][1];
		   } 
		}
		
		//merge HSL and base values
		var googleL;
		var googleS;
		if(L<Lbase){
			googleL = L*100/Lbase-100;
		}else if(L>Lbase){
			googleL = (L-Lbase)*100/(100-Lbase);
		}else{
			googleL = Lbase;
		}
		
		if(S<Sbase){
			googleS = S*100/Sbase-100;
		}else if(S>Sbase){
			googleS = (S-Sbase)*100/(100-Sbase);
		}else{
			googleS = Sbase;
		}
		
		//add to style Array
		this.styles[id].featureType = featureType;
		this.styles[id].elementType = elementType;
		this.styles[id].stylers = [];
		this.styles[id].stylers.push({hue: "#"+color});
		this.styles[id].stylers.push({saturation: Math.round(googleS)});
		this.styles[id].stylers.push({lightness: Math.round(googleL)});	
		this.renderStyle();
	};
	
	//update map Style
	this.renderStyle = function()
	{
		var styledMapType = new google.maps.StyledMapType(this.styles, { name: 'Styled' });
        this.map.mapTypes.set('Styled', styledMapType);
		this.writeCode();
	}
	
	this.copyToClipboard = function()
	{
	
	}
	
	this.writeCode = function()
	{
		
		var center = this.map.getCenter();
		var zoom = this.map.getZoom();
		output = "var styles = "
		output += this.getJson();
		output += "\nvar options = {\n"
		output += "	mapTypeControlOptions: {\n"
		output += "		mapTypeIds: [ 'Styled']\n"
		output += "	},\n"
		output += "	center: new google.maps.LatLng("+center.lat()+", "+center.lng()+"),\n"
		output += "	zoom: "+zoom+",\n"
		output += "	mapTypeId: 'Styled'\n"
        output += "};\n"
        output += "var div = document.getElementById('map');\n"
        output += "var map = new google.maps.Map(div, options);\n"
        output += "var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });\n"
        output += "map.mapTypes.set('Styled', styledMapType);\n"
		
		document.getElementById('json').innerHTML=output;
	};
	
	
	//writes Json
	this.getJson = function()
	{
		var jsonStyles = [];
		for (var i = 0; i < this.styles.length; i++) {
			jsonStyles[i] = '{\n'
			jsonStyles[i] += '    featureType: "' + this.styles[i].featureType + '",\n';
			jsonStyles[i] += '    elementType: "' + this.styles[i].elementType + '",\n';
			jsonStyles[i] += '    stylers: [\n';
			var jsonStylers = []
			for (var j = 0; j < this.styles[i].stylers.length; j++) {
				for (var p in this.styles[i].stylers[j]) {
					switch (p) {
						case 'hue':
							jsonStylers[j] = '      { ' + p + ': "' + this.styles[i].stylers[j][p] + '" }';
							break;
						default:
							jsonStylers[j] = '      { ' + p + ': ' + this.styles[i].stylers[j][p] + ' }'
					}
				}
			}
			jsonStyles[i] += jsonStylers.join(',\n');
			jsonStyles[i] += '\n    ]\n';
			jsonStyles[i] += '  }';
		}
		var json = '[\n  ' + jsonStyles.join(',') + '\n]';
		return json;
	}

}

var gmc = new googlemapcolorizer();