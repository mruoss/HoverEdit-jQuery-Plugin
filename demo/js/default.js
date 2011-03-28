jQuery(document).ready(function () {
    jQuery('.hover-edit-element').hoveredit({
    	saveCallback: saveElement,
    	autoresize: true
    });
})


saveElement = function (wrapper, form_element, old_value) {
	window.setTimeout(function () {wrapper.hoveredit('success')}, 1000);
}

