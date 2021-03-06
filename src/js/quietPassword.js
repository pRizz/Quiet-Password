// main.js

// from http://stackoverflow.com/questions/754607/can-jquery-get-all-css-styles-associated-with-an-element ;-)
// get all css attributes for pesky websites with html id styling
function css(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}

$(function(){
	var debugMode = false;
	
	var passwordFieldEmptyColor = "#FFC090"; // light orange
	var passwordFieldNonEmptyColor = "#BBFFBB"; // light green
	
	var placeholderText = "Password";
	
	var $passwordFields = $("input[type='password']");
	if($passwordFields.length > 0){
		// make placeholder color dark gray
		$("head").append("<style>::-webkit-input-placeholder{color: #666}</style>");
	}

	for(var i = 0; i < $passwordFields.length; i++){
		var $passwordField = $($passwordFields[i]);
		var $passwordFieldClone = $passwordField.clone()
			.css(css($passwordField)) // get all styling of original, like id styling that gets missed
			.css({
				position: "absolute", // don't affect other divs
				"background-color": $passwordField.val() ? passwordFieldNonEmptyColor : passwordFieldEmptyColor,
			})
			.attr("id", $passwordField.attr("id") + i)
			.attr("name", $passwordField.attr("name") + i)
			.attr("placeholder", $passwordField.val() ? "" : placeholderText)
			.val("");
		
		// insert clone right after the password field in DOM
		$passwordField.after($passwordFieldClone);
		// position the password cover directly over the original field
		$passwordFieldClone.position({
			of: $passwordField
		});

		// add and remove placeholder on the clone when the original is focused in/out
		$passwordField.on("focus", {
			"$passwordFieldClone": $passwordFieldClone
		}, function(evt){
			evt.data.$passwordFieldClone.attr("placeholder", "");
		});
		$passwordField.on("focusout", {
			"$passwordField": $passwordField,
			"$passwordFieldClone": $passwordFieldClone
		}, function(evt){
			if(evt.data.$passwordField.val().length === 0){
				evt.data.$passwordFieldClone.attr("placeholder", placeholderText);
			} else {
				evt.data.$passwordFieldClone.attr("placeholder", "");
			}
		});
		
		$passwordFieldClone.on("focus", {
			"$passwordField": $passwordField
		}, function(evt){
			evt.data.$passwordField.focus(); // delegate the focus
		});
		
		$passwordField.on("keyup change", {
			"$passwordField": $passwordField,
			"$passwordFieldClone": $passwordFieldClone
		}, function(evt){
			if(debugMode){
				console.log("evt, ", evt);
				console.log("passwordField changed");
				console.log("$passwordField.val(): " + evt.data.$passwordField.val());
				console.log("$passwordField.val().length: " + evt.data.$passwordField.val().length);
			}
			if(evt.data.$passwordField.val().length === 0){
				evt.data.$passwordFieldClone.css({
					"background-color": passwordFieldEmptyColor
				});
			} else {
				evt.data.$passwordFieldClone.css({
					"background-color": passwordFieldNonEmptyColor // light green
				});
			}
		});
	
		if(debugMode){
			setInterval(function($passwordField){
				console.log("$passwordField.val(): " + $passwordField.val());
			}, 3000, $passwordField);	
		}
		
		// rechecks the original password field for changes and adjusts the password cover
		var checkPasswordField = function($passwordField, $passwordFieldClone){
			// resize
			$passwordFieldClone.width($passwordField.width());
			// reposition
			$passwordFieldClone.position({
				of: $passwordField
			});
			if($passwordField.val().length === 0){
				$passwordFieldClone.css({
					"background-color": passwordFieldEmptyColor
				});
			} else { // filled already or autofilled by chrome
				$passwordFieldClone.css({
					"background-color": passwordFieldNonEmptyColor // light green
				})
				.attr("placeholder", "")
				.val("");
			}
		};
		// kinda hacky, but there is no event fired after chrome autofill
		setTimeout(checkPasswordField, 1, $passwordField, $passwordFieldClone);
		setTimeout(checkPasswordField, 10, $passwordField, $passwordFieldClone);
		setTimeout(checkPasswordField, 50, $passwordField, $passwordFieldClone);
	}
	
	// add tooltip
	// add way to remove cover
});