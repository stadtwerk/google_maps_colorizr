function googlemapcolorizer()
{
	var styles = [];
	var map;
	var index;
	var googleBaseValues;
	var styles;
	
	this.init = function()
	{
		var options = {
			mapTypeControlOptions: {
				mapTypeIds: [ 'Styled']
			},
			center: new google.maps.LatLng(30, 0),
			zoom: 1,
			mapTypeId: 'Styled'
        };
        
        var div = document.getElementById('map');
        this.map = new google.maps.Map(div, options);
        var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
        this.map.mapTypes.set('Styled', styledMapType);
		this.index = 0;
		this.setGoogleBaseValues();
		this.styles = new Object();
		this.appendItemDiv();
		
	};
	
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
	
	this.appendItemDiv = function()
	{
		this.index++;
		document.getElementById("items").appendChild(this.getItemDiv());
	};
	
	this.deleteItemDiv = function(button)
	{
		var lastindex = this.index;
		var item = button.parentNode.parentNode;
		document.getElementById("items").removeChild(item);
	};
	
	this.getItemDiv = function()
	{
		value = '<input type="hidden" name="id" value="'+this.index+'">';
		value += '<div class="wrap">';
		value += '	<div class="left">featureTyp: </div>';
		value += '	<div class="right">';
		value += '		<select name="featureTyp">';
		value += '			<option>water</option>';
		value += '			<option>landscape.man_made</option>';
		value += '			<option>landscape.natural</option>';
		value += '			<option>poi.medical</option>';
		value += '			<option>poi.school</option>';
		value += '			<option>poi.place_of_worship</option>';
		value += '			<option>poi.park</option>';
		value += '			<option>road.highway</option>';
		value += '			<option>road.arterial</option>';
		value += '			<option>road.local</option>';
		value += '		</select>';
		value += '	</div>';
		value += '</div>';
		value += '<div class="wrap">';
		value += '	<div class="left">elementType: </div>';
		value += '	<div class="right">';
		value += '		<select name="elementType">';
		value += '			<option>all</option>';
		value += '			<option>geometry</option>';
		value += '			<option>labels</option>';
		value += '		</select>';
		value += '	</div>';
		value += '</div>';
		value += '<div class="wrap">';
		value += '	<div class="left">RGB Value: </div>';
		value += '	<div class="right"><input type="text" name="RGBValue"  onkeyup="gmc.checkColor(this)"/></div>';
		value += '</div>';
		value += '<div><input type="button" value="-" onclick="gmc.deleteItemDiv(this)"></div>';
		newItemDiv = document.createElement('div');
		newItemDiv.setAttribute('id',"item"+this.index);
		newItemDiv.setAttribute('class',"item");
		newItemDiv.innerHTML = value;
		return newItemDiv;
	};

	
	this.checkColor = function(input)
	{
		var color = input.value;
		if(color.substring(0,1) == "#")
			color = color.substring(1,color.length);
		if(!isNaN("0x"+color) && (color.length == 3 || color.length == 6)){
			input.className="";
			gmc.Calculate(input.parentNode.parentNode.parentNode.firstChild.value, color, input.parentNode.parentNode.parentNode.getElementsByTagName("select")[0].value, input.parentNode.parentNode.parentNode.getElementsByTagName("select")[1].value);
		}else{
			input.className="red";
		}
	};

	this.Calculate=function(id, color, featureType, elementType){
		var RGB = color;
		if (RGB.length==6){
			var R = parseInt(RGB.substring(0,2), 16)/255;
			var G = parseInt(RGB.substring(2,4), 16)/255;
			var B = parseInt(RGB.substring(4,6), 16)/255;
		}else{
			var R = parseInt(RGB.substring(0,1)+RGB.substring(0,1), 16)/255;
			var G = parseInt(RGB.substring(1,2)+RGB.substring(1,2), 16)/255;
			var B = parseInt(RGB.substring(2,3)+RGB.substring(2,3), 16)/255;
		}
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
		
		for (var i=0, item; item=this.googleBaseValues[i]; i++) {
		   if (this.googleBaseValues[i][0] == featureType) {
			 var Lbase = this.googleBaseValues[i][2]
			 var Sbase = this.googleBaseValues[i][1]
		   } 
		}
		
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
		// this.styles[id] = new Object();
		// this.styles[id]['featureType'] = featureType;
		// this.styles[id]['elementType'] = elementType;
		// this.styles[id]['stylers'] = new Object();
		// this.styles[id]['stylers']['hue'] = '"'+color+'"';
		// this.styles[id]['stylers']['saturation'] = googleS;
		// this.styles[id]['stylers']['lightness'] = googleL;
		this.styles.id = new Object();
		this.styles.id.featureType = featureType;
		this.styles.id.elementType = elementType;
		this.styles.id.stylers = new Object();
		this.styles.id.stylers.hue = '"'+color+'"';
		this.styles.id.stylers.saturation = googleS;
		this.styles.id.stylers.lightness = googleL;
		var myJsonText = JSON.stringify(this.styles);
		console.log(id);
		console.log(this.styles);
		console.log(myJsonText);
	};
}

var gmc = new googlemapcolorizer();