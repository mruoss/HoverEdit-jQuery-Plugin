# HoverEdit jQuery Plugin

HoverEdit can be used to create forms where fields are edited and saved individually like user account forms or similar. You won't need a <form>-Tag or submit button any more. Form elements are saved as soon as the cursor leaves.

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

# Additional Plugins

- Use [**autoresize jQuery plugin**]: http://james.padolsey.com/javascript/jquery-plugin-autoresize/ "Autoresize jQuery plugin" for textareas

