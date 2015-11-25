(function() {
    // var commitMsgSelector = '.subject';
    var commitMsgSelector = '#commit-list-container .iterable-item:not(.merge) .subject';

    var tests = {
        // underscore so it gets executed first
        _messageExists: messageExists,
        startsWithCapitalLettter: startsWithCapitalLettter,
        hasDesiredSubjectLength: hasDesiredSubjectLength,
        doesNotEndWithDot: doesNotEndWithDot
    };

    var colors = {
        true: 'green',
        false: 'red'
    };

    function isValidCommitMessage(message) {
        var testNames = Object.keys(tests);

        for(var i = 0, l = testNames.length; i < l; i++) {
            if (!tests[testNames[i]](message)) {
                console.warn('failed:', testNames[i], message);
                return testNames[i];
            }
        }

        return true;
    }

    function _getStyles() {
        return '.iterable-item[data-commit-police]{position:relative}.iterable-item[data-commit-police]:after{position:absolute;content:attr(data-commit-police);border-radius:5px;padding:5px 10px;background:rgba(255,0,0,.8);box-shadow:0 0 4px #222;text-shadow:0 0 1px rgba(0,0,0,0.3);border:1px solid #000;color:#000;left:200px;transform:translate(0) scale(.0001);opacity:0;transition:all .1s ease-in-out;z-index:999}.iterable-item[data-commit-police]:hover:after{transform:translate(-100%,0) scale(1);opacity:1}';
    }

    function injectStyles() {
        if ($('#commit-police-styles').length) {
            // already injected
            return;
        }

        $('<style id="commit-police-styles" type="text/css"/>')
            .text(_getStyles())
            .appendTo('head');
    }

    function testEachCommit() {
        $(commitMsgSelector)
            .each(function(i, el) {
                var $el = $(el),
                    message = $el.text()
                    testsReturnValue = isValidCommitMessage(message),
                    success = testsReturnValue === true,
                    color = colors[success];

                if(!success) {
                    $el.closest('.iterable-item').attr('data-commit-police', testsReturnValue);
                }

                $(el).css('color', color);
            });
    }

    function init() {
        injectStyles();
        testEachCommit();
    }


    // tests
    function _isUpperCase(text) {
        // return text.toUpperCase() === text;
        return /[A-Z]/.test(text);
    }

    function messageExists(message) {
        return !!message;
    }

    function startsWithCapitalLettter(message) {
        if (!message) {
            return false;
        }

        var firstLetter = message[0];

        if (firstLetter === '[') {
            if(/^\[.*?\]/.test(message)) {
                firstLetter = message.replace(/^\[.*?\]\s*(.*)/, '$1')[0];

                if (!firstLetter) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return _isUpperCase(firstLetter);
    }

    function hasDesiredSubjectLength(message) {
        var maxLength = 72;

        return message && message.length <= maxLength;
    }

    function doesNotEndWithDot(message) {
        // must necessarily end with an alpha-numeric value
        // or a new line... thanks, Bitbucket!@#$
        return /[a-z0-9\n\s]$/i.test(message);
    }

    init();
})();
