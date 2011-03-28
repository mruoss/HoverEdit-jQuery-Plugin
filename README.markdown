# HoverEdit jQuery Plugin

HoverEdit can be used to create forms where fields are edited and saved individually like user account forms or similar. You won't need a &lt;form&gt;-Tag or submit button any more. Form elements are saved as soon as the cursor leaves.

This plugin does not save any data. It only provides the GUI frontend. Whoever uses it has to provide an ajax backend to store the values.

# Usage

## Markup

    <input type="text" name="first_name" class="hover-edit">
    <input type="text" name="last_name" class="hover-edit">
    <textarea type="text" name="status_message" class="hover-edit"></textarea>

## Javascript

    jQuery(document).ready(function () {
        jQuery('.hover-edit').hoveredit({
            autoresize: true, // Download autoresize plugin from http://james.padolsey.com/javascript/jquery-plugin-autoresize/
            success: function (wrapper, form_element, old_value) {
                // Do some ajax to save the form_element and finally call
                if (successful) {
                    wrapper.hoveredit('success');
                } else {
                    wrapper.hoveredit('error');
                }

            }
        });
    });

# Demo

<link href="https://github.com/mruoss/HoverEdit-jQuery-Plugin/raw/master/themes/default/css/styles.css" media="screen, projection" rel="stylesheet" type="text/css" />
<link href="https://github.com/mruoss/HoverEdit-jQuery-Plugin/raw/master/themes/default/css/demo.css" media="screen, projection" rel="stylesheet" type="text/css" />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script src="https://github.com/mruoss/HoverEdit-jQuery-Plugin/raw/master/demo/js/autoresize.jquery.min.js" type="text/javascript"></script>
<script src="https://github.com/mruoss/HoverEdit-jQuery-Plugin/raw/master/js/hoveredit.jquery.min.js" type="text/javascript"></script>
<script src="js/default.js" type="text/javascript"></script>
<p>
			This demo shows the default behaviour of HoverEdit with the default theme. The saving process is one second of doing nothing to demonstrate an ajax call.
</p>
<p>
	<label for="inputfield1">First Name:</label>
	<input type="text" id="inputfield1" class="hover-edit-element" name="inputfield1"/>
</p>
<p>
	<label for="inputfield1">My Status:</label>
	<textarea id="inputfield2" class="hover-edit-element" name="inputfield2"></textarea>
</p>
<p>
	<label for="inputfield1">Password:</label>
	<input type="password" id="inputfield3" class="hover-edit-element" name="inputfield3"/>
</p>

# Additional Plugins

- Use **[Autoresize]** for textareas to get a nicer UI.

[Autoresize]: http://james.padolsey.com/javascript/jquery-plugin-autoresize/ "Autoresize jQuery plugin"

