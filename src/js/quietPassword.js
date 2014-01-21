// main.js

$(function(){
	$body = $("body");
	console.log("body, ", $body);
	
	var $passwordField = $("input[type='password']");
	console.log("passwordField, ", $passwordField);
	if($passwordField.length !== 0){
		var passwordFieldOffset = $passwordField.offset();
		console.log("passwordFieldOffset.top, ", passwordFieldOffset.top);
		console.log("passwordFieldOffset.left, ", passwordFieldOffset.left);
		var passwordFieldPosition = $passwordField.position();
		console.log("passwordFieldPosition.top, ", passwordFieldPosition.top);
		console.log("passwordFieldPosition.left, ", passwordFieldPosition.left);
	
		var $passwordFieldClone = $passwordField.clone().css({
			display: "none",
			"background-color": "#BBFFBB"
		});
		
		$body.append($passwordFieldClone);
	
		setTimeout(function(){		
			$passwordFieldClone.fadeIn(1);
			// wierd issue if offset is done before fadeIn call
			$passwordFieldClone.offset({
				// top: passwordFieldOffset.top+20,
				// left: passwordFieldOffset.left
				top: passwordFieldOffset.top,
				left: passwordFieldOffset.left
			});
		});
	
		$passwordField.focus(function(evt){
			console.log("password field focued");
			// evt.preventDefault();
		});
	
		$passwordFieldClone.focus(function(evt){
			console.log("password field clone focued");
			$passwordField.focus();
			// evt.preventDefault();
		});
	
		$passwordFieldClone.on('keypress', $passwordField, function(evt){
			console.log("password field clone keypress");
			evt.preventDefault();
		});
	
		setInterval(function(){
			console.log("$passwordField.val(): " + $passwordField.val());
			console.log("$passwordField.innerHTML: " + $passwordField[0].innerHTML);
		}, 3000);		
	}
	
	// add tooltip
	// add way to remove cover
});