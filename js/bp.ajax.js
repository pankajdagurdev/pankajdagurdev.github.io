/**

	Abstract : Ajax Page Js File
	File : bp.ajax.js
	#CSS attributes: 
		.bpForm : Form class for ajax submission. 
		.bpFormMsg  : Div Class| Show Form validation error/success message on ajax form submission
		
	#Javascript Variable
	.bpRes : ajax request result variable
	.bpFormAction : Form action variable
	.bpFormData : Form serialize data variable

**/

/* Cookies Function */
function setCookie(cname, cvalue, exhours) {
	var d = new Date();
	d.setTime(d.getTime() + (30 * 60 * 1000)); /* 30 Minutes */
	var expires = "expires=" + d.toString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function deleteCookie(cname) {
	var d = new Date();
	d.setTime(d.getTime() + (1)); // 1/1000 second
	var expires = "expires=" + d.toString();
	document.cookie = cname + "=1;" + expires + ";path=/";
}
/* Cookies Function END */

function contactForm()
{
	window.verifyRecaptchaCallback = function (response) {
        $('input[data-recaptcha]').val(response).trigger('change');
    }

    window.expiredRecaptchaCallback = function () {
        $('input[data-recaptcha]').val("").trigger('change');
    }
	'use strict';
	var msgDiv;
	
	$(".bpForm").on('submit',function(e){
		e.preventDefault();	//STOP default action
		$('.bpFormMsg').html('<div class="gen alert alert-success">Submitting..</div>');
		var bpFormAction = $(this).attr('action');
		var bpFormData = $(this).serialize();
		
		$.ajax({
			method: "POST",
			url: bpFormAction,
			data: bpFormData,
			dataType: 'json',
			success: function(bpRes){
				if(bpRes.status == 1){
					msgDiv = '<div class="gen alert alert-success">'+bpRes.msg+'</div>';
				}
				if(bpRes.status == 0){
					msgDiv = '<div class="err alert alert-danger">'+bpRes.msg+'</div>';
				}
				$('.bpFormMsg').html(msgDiv);
				
				
				setTimeout(function(){
					$('.bpFormMsg .alert').hide(1000);
				}, 10000);
				
				$('.bpForm')[0].reset();
                grecaptcha.reset();
			}
		})
	});
	
	
	/* This function is for mail champ subscription START*/
	$(document).on('submit', ".bpSubscribe",function(e){
		e.preventDefault();	//STOP default action
		var thisForm = $(this);
		var bpFormAction = thisForm.attr('action');
		var bpFormData = thisForm.serialize();
		thisForm.addClass('bp-ajax-overlay');
		
		$.ajax({
			method: "POST",
			url: bpFormAction,
			data: bpFormData,
			dataType: 'json',
			success: function(bpRes) {
			thisForm.removeClass('bp-ajax-overlay');
			
			if(bpRes.status == 1){
				msgDiv = '<div class="gen alert alert-success">'+bpRes.msg+'</div>';
				setCookie('prevent_subscription', 'true', 1);
			}
			if(bpRes.status == 0){
				msgDiv = '<div class="err alert alert-danger">'+bpRes.msg+'</div>';
			}
			$('.bpSubscribeMsg').html(msgDiv);
			
			setTimeout(function(){
				$('.bpSubscribeMsg .alert').hide(1000);
			}, 10000);
			
			$('.bpSubscribe')[0].reset();
		  }
		})
	});
	
	/* This function is for mail champ subscription END*/
	
	/* ajax load more Start*/
	$(".bp-load-more").on('click', function(e){
		e.preventDefault();	//STOP default action
		var bpLoadMoreUrl = $(this).attr('rel');
		
		$('.bp-load-more').append(' <i class="fa fa-refresh"></i>');
		$.ajax({
			method: "POST",
			url: bpLoadMoreUrl,
			dataType: 'html',
			success: function(data) {
			$( ".loadmore-content").append(data);
			$('.bp-load-more i').remove();
		  }
		})
	});
	/* ajaz load more END*/
}

jQuery(document).ready(function() {
    'use strict';
	contactForm();
})