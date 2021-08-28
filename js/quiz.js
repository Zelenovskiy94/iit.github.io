activeSlide(0)
nextButton ()
backButton ()

let objData = {}

function activeSlide (item) {
	let countItems = jQuery('.quiz_question').length
	jQuery('.progress').css('width', 100 / countItems * (item+1) + '%' )
	jQuery('.quiz_question').each(function(index) {
		jQuery(this).attr('data-item', index)
		if(item == 0){
			jQuery('#cancel').css('display', 'block')
			jQuery('#back').css('display', 'none')
		} else {
			jQuery('#cancel').css('display', 'none')
			jQuery('#back').css('display', 'block')
		}
		if(index == item) {
			jQuery(this).addClass('active')
			if(jQuery(this).hasClass('valid')) {
				nextButton (true)
			} else {
				nextButton (false)
			}
		} else {
			jQuery(this).removeClass('active')
		}
	})
	if(item == countItems - 1) {
		jQuery('#next').addClass('finish')
	}
	
	backButton ()
}
function nextButton (status = false, last) {
	let currentSlideIndex = +jQuery('.quiz_question.active').attr('data-item')
	let buttunNext = jQuery('#next')
	buttunNext.attr('next-item', currentSlideIndex + 1)
	if(status) {
		jQuery('#next').removeClass('disabled')
	} else {
		jQuery('#next').addClass('disabled')
	}

}
function backButton () {
	let currentSlideIndex = +jQuery('.quiz_question.active').attr('data-item')
	let buttunBack = jQuery('#back')
	let prevSlide = currentSlideIndex - 1
	if(prevSlide < 0) {
		prevSlide = 0
	}
	buttunBack.attr('prev-item', prevSlide)
	
}

function isValid (elem) {
	let inputs = $(elem).find('input[type="text"]')
	let isValidField = false
	isValidField = Array.from(inputs).every(function(elem){
		return $(elem).hasClass('valid')
		
	});
	nextButton(isValidField)
}
function validateEmail(email) {
	let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	return re.test(String(email).toLowerCase());
}
function validateNameName(str) {
	return str && isNaN(str) && str.length < 40
}
function validPhone(phone) {
	var re = /^\+?\d[\d\(\)\ -]{5,14}\d$/;
	return re.test(phone);
}  
$('input[type="radio"]').on('click', function(){
	if($(this).is(':checked')) {
		nextButton(true)
		$(this).closest('.quiz_question').addClass('valid')
	}
})
$('#nameSchool, #yourName, #yourEmail, #yourPhone').on('input keyup', function(){
	let validClass = () => {
		$(this).addClass('valid')
		$(this).removeClass('invalid')
		$(this).closest('.quiz_question').addClass('valid')
	}
	if(this.id == 'nameSchool' && $(this).val() != '') {
		validClass()
	} else if(this.id == 'yourEmail' && validateEmail($(this).val()) && $(this).val() != ''){
		validClass()
	} else if(this.id == 'yourName' && validateNameName($(this).val()) && $(this).val() != ''){
		validClass()
		localStorage.setItem('quiz_name', $(this).val());
	} else if(this.id == 'yourPhone' && validPhone($(this).val()) && $(this).val() != ''){
		validClass()
	} else {
		$(this).addClass('invalid')
		$(this).removeClass('valid')
		$(this).closest('.quiz_question').removeClass('valid')
	}
	isValid ($(this).closest('.quiz_question'))
})
$('#next').on('click', function(){
	if( $(this).hasClass('finish') ) {
		jQuery('.quiz_question input:checked').each(function(index) {
			let name = $(this).attr('name')
			objData[name] = $(this).val()
		})
		jQuery('.quiz_question input[type="text"]').each(function(index) {
			let name = $(this).attr('name')
			objData[name] = $(this).val()
		})
		sentResponse({
			"Did you attend school in 2020": objData.attend,
			"What’s the name of the school you attended?" : objData.nameSchool,
			"What’s the last school grade you completed?" : objData.last_grade,
			"Which grade are you applying for?" : objData.applying_grade,
			"Which are you most interested in?" : objData.interest,
			"Do you have access to a computer/laptop/tablet for school purposes?" : objData.access_to_tech,
			"Which fee structure are you interested in?" : objData.structure,
			"Name" : objData.your_name,
			"Email" : objData.your_email,
			"Phone" : objData.your_phone,
		})
		return
	}
	activeSlide(+$(this).attr('next-item'))
	document.getElementById('progress').scrollIntoView({
		behavior: 'smooth',
		block: 'start'
		})
})
$('#back').on('click', function(){
	activeSlide(+$(this).attr('prev-item'))
	jQuery('#next').removeClass('finish')
})

function sentResponse(objData) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'https://hooks.zapier.com/hooks/catch/10786736/b49g70w/', true);
	xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
	xhr.send(JSON.stringify(objData));
	xhr.onload = () => {
		redirectToThanksPage ()
	}

}
function redirectToThanksPage () {
	window.location.replace("thanks.html");
}
