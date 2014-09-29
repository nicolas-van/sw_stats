
(function() {
    "use strict";

    window.app = {};

    app.main = function() {
        $("#dice").change(displaySuccess);
        $("#wild-dice").change(displaySuccess);
        $("#bonus").change(displaySuccess);
        $("#difficulty").change(displaySuccess);
        displaySuccess();
    };

    function displaySuccess() {
        var rolls = explodingRolls(parseInt($("#dice").val()));
        if ($("#wild-dice").val()) {
            rolls = combine(rolls, explodingRolls(parseInt($("#wild-dice").val())));
        }
        rolls = applyModif(rolls, parseInt($("#bonus").val()));
        var rate = success(rolls, parseInt($("#difficulty").val()));
        $("#success-rate").text("" + Math.round(rate * 100) + "%");
        var raise = success(rolls, parseInt($("#difficulty").val()) + 4);
        $("#raise-rate").text("" + Math.round(raise * 100) + "%");
    }

    function simpleRolls(dice) {
        return _.map(_.range(1, dice + 1), function(x) {
            return [1 / dice, x];
        });
    }

    function explodingRolls(dice, maxExplode) {
        maxExplode = maxExplode || 5;
        var result = [[1, 0]];
        _.each(_.range(maxExplode), function(i) {
            var tmp = simpleRolls(dice);
            var roll = result[result.length - 1];
            result = result.slice(0, result.length - 1).concat(_.map(tmp, function(x) {
                return [x[0] * roll[0] , x[1] + roll[1]];
            }));
        });
        return result;
    }

    function applyModif(rolls, modif) {
        return _.map(rolls, function(el) {
            return [el[0], el[1] + modif];
        });
    }

    function combine(rolls1, rolls2) {
        var lst  = [];
        _.each(rolls1, function(el1) {
            _.each(rolls2, function(el2) {
                // take snake eyes into account
                var result = Math.max(el1[1], el2[1]);
                lst.push([el1[0] * el2[0], result === 1 ? -10000 : result]);
            });
        });
        return lst;
    }

    function success(chances, target) {
        var acc = 0;
        _.each(chances, function(el) {
            if (el[1] >= target) {
                acc += el[0];
            }
        });
        return acc;
    }

})();