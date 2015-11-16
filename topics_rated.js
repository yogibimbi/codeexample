/*
 * @requires ../../modules/rating/rating.js
 */

/*
 *  Description : rated topics, as used in the "more" section for the newsletter signup
 *  Author      : JLo @ Customer AG
 *  License     : All rights reserved Customer AG
 */
(function ($, window, document, Customer, undefined) {
	'use strict';

	var Plugin,
		pluginName = 'topicsrated',
		events = {},
		defaults = {
		},
		$document = $(document);


	// Globally accessible data like event names
	Customer.modules[pluginName] = {
		events: events
	};

	/**
	 * Create an instance of the module
	 * @param {object} element The DOM element to bind the module
	 * @param {object} options Options overwriting the defaults
	 * @constructor
	 */
	Plugin = function (element, options) {
		// Call super constructor

		this.helper = Customer.modules.PluginHelper;
		this.helper(pluginName, defaults, element, options);
	};

	/**
	 * Initializes the module, binds the Events.
	 */
	Plugin.prototype.init = function () {
		// react to check tabs action, toggle visibility of the corresponding topic ratings div
		$('[type=checkbox][name^=registration]').click(this.selectTab);
		// react to check ratings action, toggle visibility of the corresponding ratings div
		$('.rating_topic [type=checkbox]').click(this.activateRating);
	};

	Plugin.prototype.selectTab = function () {
		var tab = this.name.replace(/^registration-/, '');
		var columnId = '#' + tab + '_column';
		$(columnId + ' > .disabler').toggleClass('visible', !this.checked);
		if (!this.checked) {
			// uncheck all ratings in this topic
			$(columnId + ' .mod_rating [type=checkbox]').each(function () {
				this.checked = false;
			});
			$(columnId + ' .mod_rating .checker span.checked').removeClass('checked');
		}
	};

	Plugin.prototype.activateRating = function () {
		var $topic = $(this).closest('.rating_topic');
		var $rating = $('+ .rating', $topic);
		$('.disabler', $rating).toggleClass('visible', !this.checked);
		var $modRating = $('.mod_rating', $rating);
		$modRating.toggleClass('disabled', !this.checked).find('label.star').toggleClass('disabled', !this.checked);
		var $radio = $modRating.find('input[type=radio]');

		if (!this.checked) {
			$modRating.removeClass('selected').find('label.star').removeClass('selected');
			$radio.attr('disabled', 'disabled');
		}
		else {
			$radio.removeAttr('disabled');
			$($radio[0]).focus();
		}
	};

	/**
	 * Register events in Customer object. PRIVATE function.
	 * @param  {object} events Events related each media query, normally 2 events: in and out.
	 */
	Plugin.prototype._registerEvents = function (events) {
		if (typeof(events) !== 'object') { return; }
		$.extend(Customer.modules[pluginName].events, events);
	};

	// Make the plugin available through jQuery (and the global project namespace)
	Customer.modules.PluginHelper.register(Plugin, pluginName);

	// Bind the module to particular events and elements
	$document.on('ready ajax_loaded', function () {
		$.fn[pluginName].apply($(document));
	});

})(jQuery, window, document, Customer);
