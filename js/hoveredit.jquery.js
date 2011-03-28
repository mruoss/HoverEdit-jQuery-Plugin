/**
 * HoverEdit is a jQuery Plugin by Michael Ruoss
 *
 * (c) Copyright 2011, Michael Ruoss <michael.ruoss@ufirstgroup.com>
 *
 * JQuery plugin for on-hover form elements. Your form elements will be displayed
 * as normal text until the user hovers with the mouse over them. On mouse over,
 * the actual form element gets visible and the normal text disappears.
 *
 * After changing the value in the form element, press enter, tab or just
 * klick somewhere outside the field to trigger the save callback function
 * which has to be provided by the caller.
 * Pressing ESCAPE will cancel the modification.
 *
 * Use class 'input-required' to force non-empty input validation.
 *
 * Events:
 *   The plugins defines and triggers custom events on the form element:
 *   error.input-required: Is triggered if the user tries to empty a
 *                         required field. The caller of the plugin has
 *                         to handle errors e.g. display an error message.
 *
 * Example:
 *   HTML:
 *     <input type="text" id="nickname" name="nickname" value="#user.username#" class="hover-edit input-required"/>
 *
 *   Javascript:
 *     jQuery('.hover-edit').hoveredit({
 *         saveCallback: function(){ do some ajax here and then call this.hoveredit('success') or this.hoveredit('cancel')};
 *     });
 *
 * @author: Michael Ruoss <michael.ruoss@ufirstgroup.com>
 */


(function( $ ){

	/**
	 * Default settings
	 */
	var settings = {
		saveCallback: null,
		autoresize: false
	};

	/**
	 * Plugin methods
	 */
	var methods = {};

	/**
	 * Plugin initialization. Sets up all the required additional elements
	 * like save, edit, cancel and registers the event handlers.
	 * @this Is the jquery object of the form element
	 */
	methods.init = function(options) {
		$.extend(settings, options);
		return this.each(function() {
			var form_field = $(this);

			/***** CREATE HELPER ELEMENTS *****/

			/* the wrapper div wraps around form element and action elements (save,edit,cancel,...) */
			var wrapper = $('<div>')
				.addClass('hover-edit-wrapper')
				.insertAfter(form_field)
				.append(form_field)
				.width(form_field.outerWidth()+1);

			wrapper.form_element = form_field;

			/* form_value holds the value of the form element as plain text */
			var form_value = $('<div>')
				.addClass('hover-edit-value')
				.height(form_field.height())
				.width(form_field.width())
			wrapper.form_value = form_value;

			methods._copyValue.apply(wrapper);

			wrapper
				.prepend(form_value)
				.prepend($('<div>')
					.addClass('loading')
				);

			/* Add action elements (not for select fields though) */
			if (!form_field.is('select')) {
				wrapper.append($('<a>')
						.addClass('edit')
						.bind('click', function () {
							methods.edit.apply(wrapper);
						})
					)
				.append($('<a>')
					.addClass('save')
					.bind('mousedown', function () {
						methods.save.apply(wrapper);
					})
				)
				.append($('<a>')
					.addClass('cancel')
					.bind('mousedown', function () {
						methods.cancel.apply(wrapper);
					})
				);
			}

			/* if autoresize plugins is available, use it for textarea */
			if (settings.autoresize && form_field.is('textarea')) {
				if (typeof form_field.autoResize == 'function') {
					form_field.autoResize({
						// On resize:
						animateCallback : function() {
							form_value.height($(this).height());
						},
						extraSpace: 0,
						animateDuration: 0
					});
				} else {
					$.error('Autoresize plugin is not available. Download it from http://james.padolsey.com/javascript/jquery-plugin-autoresize/ or set {autoresize: false}');
				}
			}

			/* bind mouse/focus events on form element */
			form_field.bind('focus.hoveredit', function() {
				wrapper.addClass('focus');
				$(this).bind('blur.hoveredit', function() {
					methods.save.apply(wrapper);
				})
			})
			.bind('keydown.hoveredit', function (event) {
				switch (event.which) {
					case KeyEvent.DOM_VK_ESCAPE:
						methods.cancel.apply(wrapper);
						break;
					case KeyEvent.DOM_VK_TAB:
						methods.save.apply(wrapper);
						break;
					case KeyEvent.DOM_VK_RETURN:
						if (!jQuery(this).is('textarea')) {
							methods.save.apply(wrapper);
						}
						break;
				}
			});
		});

		return this;
	};

	/********************
	 * helper functions *
	 ********************/

	/**
	 * Save the value in the form element. This function calls the saveCallback
	 * provided by the caller if any.
	 */
	methods.save = function () {
		var form_element = this.form_element;
		var form_value = this.children('.hover-edit-value:first');
		var old_value = form_value.text();

		form_element.unbind('blur.hoveredit');
		this.removeClass('focus');
		form_element.blur();

		/* if required fields are empty */
		if (form_element.hasClass('input-required') && form_element.val() == '') {
			form_element.val(old_value);
			form_element.trigger('error.input-required', [this]);
			return false;
		}

		if (old_value != form_element.val()) {
			this.addClass('saving');
			this.old_value = old_value;
			methods._copyValue.apply(this);
			form_element.attr('disabled', 'disabled');
			if (typeof settings.saveCallback == 'function') {
				settings.saveCallback.apply(this, [form_element, old_value])
			} else {
				methods.success.apply(this);
			}
		}
	};

	/**
	 * Cancels the action without saving the value
	 */
	methods.cancel = function () {
		var form_element = this.form_element;
		var form_value = this.children('.hover-edit-value:first');
		form_element.val(form_value.text()).change();
		form_element.unbind('blur.hoveredit');

		this.removeClass('focus');
		form_element.blur();
		this.mouseleave();
	};

	/**
	 * The edit icon was clicked. Focus the form element.
	 */
	methods.edit = function () {
		this.form_element.focus();
	};

	/**
	 * Success handler - should be called by the callback
	 * @this is the wrapper element
	 */
	methods.success = function () {
		if (typeof this.form_element != 'object') {
			return this;
		};
		var form_element = this.form_element;
		var form_value = this.children('.hover-edit-value:first');
		this.removeClass('saving')
		form_element.removeAttr('disabled');
	};

	/**
	 * Error handler - should be called by the callback in case of an error
	 * @this is the wrapper element
	 */
	methods.error = function () {
		if (typeof this.form_element != 'object') {
			return this;
		};
		form_value = this.form_value
		form_value.text(this.old_value);
		methods._reCopyValue.apply(this);
		this.removeClass('saving')
		this.form_element.removeAttr('disabled');
	};

	/**
	 * Copies the value from the form element to the form_value field
	 * @this is the wrapper element
	 */
	methods._copyValue = function () {
		var form_element = this.form_element;
		var form_value = this.form_value;

		if (form_element.is('select')) {
			form_value.text(form_element.find('option:selected').text());
		} else {
			form_value.text(form_element.val());
		}
	};

	/**
	 * Copies the value from the form element to the form_value field
	 * @this is the wrapper element
	 */
	methods._reCopyValue = function () {
		var form_element = this.form_element;
		var form_value = this.form_value;
		form_element.val(form_value.text());
	};

	/**
	 * Main function
	 */
	$.fn.hoveredit = function( method ) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on $.tooltip');
		}
	};

})(jQuery);


/**
 * Some browsers have a pre-defined KeyEvent objects. For the others
 * we define them here.
 */
if (typeof KeyEvent == "undefined") {
	var KeyEvent = {
		DOM_VK_CANCEL: 3,
		DOM_VK_HELP: 6,
		DOM_VK_BACK_SPACE: 8,
		DOM_VK_TAB: 9,
		DOM_VK_CLEAR: 12,
		DOM_VK_RETURN: 13,
		DOM_VK_ENTER: 14,
		DOM_VK_SHIFT: 16,
		DOM_VK_CONTROL: 17,
		DOM_VK_ALT: 18,
		DOM_VK_PAUSE: 19,
		DOM_VK_CAPS_LOCK: 20,
		DOM_VK_ESCAPE: 27,
		DOM_VK_SPACE: 32,
		DOM_VK_PAGE_UP: 33,
		DOM_VK_PAGE_DOWN: 34,
		DOM_VK_END: 35,
		DOM_VK_HOME: 36,
		DOM_VK_LEFT: 37,
		DOM_VK_UP: 38,
		DOM_VK_RIGHT: 39,
		DOM_VK_DOWN: 40,
		DOM_VK_PRINTSCREEN: 44,
		DOM_VK_INSERT: 45,
		DOM_VK_DELETE: 46,
		DOM_VK_0: 48,
		DOM_VK_1: 49,
		DOM_VK_2: 50,
		DOM_VK_3: 51,
		DOM_VK_4: 52,
		DOM_VK_5: 53,
		DOM_VK_6: 54,
		DOM_VK_7: 55,
		DOM_VK_8: 56,
		DOM_VK_9: 57,
		DOM_VK_SEMICOLON: 59,
		DOM_VK_EQUALS: 61,
		DOM_VK_A: 65,
		DOM_VK_B: 66,
		DOM_VK_C: 67,
		DOM_VK_D: 68,
		DOM_VK_E: 69,
		DOM_VK_F: 70,
		DOM_VK_G: 71,
		DOM_VK_H: 72,
		DOM_VK_I: 73,
		DOM_VK_J: 74,
		DOM_VK_K: 75,
		DOM_VK_L: 76,
		DOM_VK_M: 77,
		DOM_VK_N: 78,
		DOM_VK_O: 79,
		DOM_VK_P: 80,
		DOM_VK_Q: 81,
		DOM_VK_R: 82,
		DOM_VK_S: 83,
		DOM_VK_T: 84,
		DOM_VK_U: 85,
		DOM_VK_V: 86,
		DOM_VK_W: 87,
		DOM_VK_X: 88,
		DOM_VK_Y: 89,
		DOM_VK_Z: 90,
		DOM_VK_CONTEXT_MENU: 93,
		DOM_VK_NUMPAD0: 96,
		DOM_VK_NUMPAD1: 97,
		DOM_VK_NUMPAD2: 98,
		DOM_VK_NUMPAD3: 99,
		DOM_VK_NUMPAD4: 100,
		DOM_VK_NUMPAD5: 101,
		DOM_VK_NUMPAD6: 102,
		DOM_VK_NUMPAD7: 103,
		DOM_VK_NUMPAD8: 104,
		DOM_VK_NUMPAD9: 105,
		DOM_VK_MULTIPLY: 106,
		DOM_VK_ADD: 107,
		DOM_VK_SEPARATOR: 108,
		DOM_VK_SUBTRACT: 109,
		DOM_VK_DECIMAL: 110,
		DOM_VK_DIVIDE: 111,
		DOM_VK_F1: 112,
		DOM_VK_F2: 113,
		DOM_VK_F3: 114,
		DOM_VK_F4: 115,
		DOM_VK_F5: 116,
		DOM_VK_F6: 117,
		DOM_VK_F7: 118,
		DOM_VK_F8: 119,
		DOM_VK_F9: 120,
		DOM_VK_F10: 121,
		DOM_VK_F11: 122,
		DOM_VK_F12: 123,
		DOM_VK_F13: 124,
		DOM_VK_F14: 125,
		DOM_VK_F15: 126,
		DOM_VK_F16: 127,
		DOM_VK_F17: 128,
		DOM_VK_F18: 129,
		DOM_VK_F19: 130,
		DOM_VK_F20: 131,
		DOM_VK_F21: 132,
		DOM_VK_F22: 133,
		DOM_VK_F23: 134,
		DOM_VK_F24: 135,
		DOM_VK_NUM_LOCK: 144,
		DOM_VK_SCROLL_LOCK: 145,
		DOM_VK_COMMA: 188,
		DOM_VK_PERIOD: 190,
		DOM_VK_SLASH: 191,
		DOM_VK_BACK_QUOTE: 192,
		DOM_VK_OPEN_BRACKET: 219,
		DOM_VK_BACK_SLASH: 220,
		DOM_VK_CLOSE_BRACKET: 221,
		DOM_VK_QUOTE: 222,
		DOM_VK_META: 224
	};
}

