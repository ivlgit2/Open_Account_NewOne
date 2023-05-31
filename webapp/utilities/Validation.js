/*Check if the value is empty*/

jQuery.sap.declare("LICE.Formatter");
LICE.Formatter = {
		ConvertJsonDate: function (value) {
		var output = "";
		if (value) {
			if (value instanceof Date) {
				var NewDateform = value;
			} else if (value.indexOf("T00:00:00")) {
				var NewDateform = new Date(value.substring(0, 10));
			} else {
				var formattedJsonDate = eval('new' + value.replace(/\//g, ' '));
				var NewDateform = new Date(formattedJsonDate);
			}
			var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
			var day = ("0" + NewDateform.getDate()).slice(-2);
			output = [day, mnth, NewDateform.getFullYear()].join("/");
		}
		return output;

	},
		convertToSAPdate:function(value){
			//alert(value);
	
				if(value){
				if(value instanceof Date){
					var NewDateform =value;	
				}else if(value.indexOf("T00:00:00")>=0){
					return value;
				}else{
				////	var year = value.substring(0, 4);
				//	var month = value.substring(4, 6);
				//	var day = value.substring(0, 2);
				}
				var mnth = ("0" + (NewDateform.getMonth()+1)).slice(-2);
				var day  = ("0" + NewDateform.getDate()).slice(-2);
				var output= [NewDateform.getFullYear(),mnth,day].join("-")+"T00:00:00";	
				return output;
				}
		}, 
			FormatDate: function (val) {
			var spl, rev;
			if (val) {
				spl = (val).split("/");
				rev = spl.reverse();
				val = rev.join("-") + "T00:00:00";
			}
			return val;
		}
};

