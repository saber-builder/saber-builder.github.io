'use strict';

let params = window.location.search.split('&');
console.log(params);

function updateForDuplicates($elem) {
	if (!$('#allow-duplicates').is(':checked') && $elem.data('uses-duplicate-check') && $elem.data('matching-slot')) {
		const $matchingPart = $($elem.data('matching-slot'));
		
		if ($matchingPart.length) {
			const $options = $matchingPart.find('option');
			$options.removeClass('d-none')
				.attr('disabled', false);
			$options.filter(`[value="${$elem.val()}"]`).addClass('d-none')
				.attr('disabled', true);
		}
	}
}

function cycleParts(ind) {
    const $selector = $(`.js-part-selector:eq(${ind})`);
    $selector.find('option').each(function (optionInd, option) {
        const $option = $(option);

        if ($option.is(':disabled')) {
            return true;
        }

        $selector.val($option.val())
            .trigger('change');

        if ($(`.js-part-selector:eq(${ind + 1})`).length) {
            cycleParts(ind + 1);
        } else {
            $('.js-compare').trigger('click');
        }
    });
}

function init() {
    $('.js-part-selector').trigger('change');
}

$(document).ready(function () {
    $('.js-part-selector').on('change', function () {
        const target = $(this).data('target');
        const $saberPart = $(target);
		
		updateForDuplicates($(this));

        if ($saberPart.length) {
            $saberPart.attr('src', $(this).val());
        }
    });

    $('.js-randomize').on('click', function () {
        $('.js-part-selector').each(function (ind, elem) {
            const $elem = $(elem);
            const partInd = Math.floor(Math.random(new Date()) * $elem.find('option:not(:disabled)').length);

            $elem.val($elem.find(`option:not(:disabled):eq(${partInd})`).val());
            $elem.trigger('change');
        });
    });
	
	$('.js-allow-duplicates').on('change', function () {
		if ($(this).is(':checked')) {
			$('.js-part-selector').find('option').removeClass('d-none')
				.attr('disabled', false);
		}
	});

    $('.js-compare').on('click', function () {
        let $saber = $('<div class="c-lightsaber js-lightsaber js-compare-lightsaber"></div>');

        $('.js-lightsaber-builder .js-lightsaber-part-wrap').each(function (ind, part) {
            const $part = $(part).clone();
            $saber.append($part);
        });

        $saber.append($('<button class="close js-close" data-target=".js-lightsaber">Remove</button>'));

        $('body').append($saber);
    });

    $('.js-compare-all').on('click', function () {
        $('.js-compare-lightsaber').remove(); // Prevent stacking of extra compares
        cycleParts(0);
    })

    $('body').on('click', '.js-close', function () {
        if ($(this).data('target')) {
            $(this).closest($(this).data('target')).remove();
        }
    });

    init(); // Make sure displayed parts match options
});