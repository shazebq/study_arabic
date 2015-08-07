var verbApp = angular.module('verbApp');

verbApp.factory('conjugator', function(helperData) {
    //c stands for conjugator
    var c = {};

    var tenses = ['perfect', 'imperfect', 'imperative', 'jussive', 'subjunctive'];
    var forms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var persons = ['firstPerson', 'secondPerson', 'thirdPerson'];
    var types = ['sound', 'hollow', 'geminate', 'weakLam', 'assimilated'];
    var genders = ['masculine', 'feminine'];
    var numbers = ['singular', 'dual', 'plural'];

    c.verb;
    c.options;
    c.list;

    c.initialize = function(verb, options) {
        c.verb = verb;
        c.options = options;
        c.list = getList();
    }

    c.setVerb = function(verb) {
        c.verb = verb;
        c.list = getList();
    }

    // get the complete name of the conjugation e.g. "first person masculine singular perfect" based on the options already specified
    c.getName = function() {
        var name = _.startCase(c.options.person);
        // first person does not have gender so account for that
        if (c.options.gender) {
            name += ' ' + c.options.gender;
        }
        name += ' ' + c.options.number
        return name.toLowerCase();
    }

    //*******************************************
    // Private methods
    //*******************************************
    function getList() {
        var list = angular.copy(helperData.pronounList);
        _.forEach(list, function(pronoun, index) {
            switch (c.verb.type.name) {
                case 'sound': pronoun.perfect = getSoundVerb(pronoun.id); break;
                case 'geminate': pronoun.perfect = getGeminateVerb(pronoun.id); break;
                case 'hollow': pronoun.perfect = getHollowVerb(pronoun.id); break;
                case 'defective': pronoun.perfect = getDefectiveVerb(pronoun.id); break;
            }
        })
        return list
    }

    function getDefectiveVerb(id) {
        // Work on defective waaw first
        var verb;
        if (hasConsonantEnding(id)) {
            verb = getSoundVerb(id);
        }
        else {
            switch (id) {
                case 5: verb = c.verb.letter1 + 'َ' + c.verb.letter2 + 'ا'; break;
                case 7: verb = getSoundVerb(id); break;
                case 12: verb = c.verb.letter1 + 'َ' + c.verb.letter2 + 'َوْا'; break;

                // Note, for 6 and 8, the waaw fathah part of the root simply disappear so get the sound verb and just remove the waaw fathah using regex
                case 6:
                case 8:
                    var regex = new RegExp(c.verb.letter3 + 'َ');
                    verb = getSoundVerb(id);
                    verb = verb.replace(regex, '');
            }
        }
        return verb;
    }

    function getHollowVerb(id) {
        // These pronouns keep the alif
        var verb;
        if (hasConsonantEnding(id)) {
            var shortVowel1;
            // This is for نام and خاف type verbs
            if (c.verb.type.type === 'alif') {
                shortVowel1 = 'ِ';
            }
            // This is for hollow waaw or hollow yaa verbs where the short vowel is based on the second root letter
            else {
                shortVowel1 = helperData.longToShort[c.verb.letter2];
            }
            verb = c.verb.letter1 + shortVowel1 + c.verb.letter3 + helperData.endings[id - 1];
        }
        else {
            verb = c.verb.letter1 + 'ا' + c.verb.letter3 + helperData.endings[id - 1];
        }
        return verb;
    }

    function getSoundVerb(id) {
        return c.verb.letter1 + 'َ'+ c.verb.letter2 + c.verb.perfectVowel + c.verb.letter3 + helperData.endings[id - 1];
    }

    function getGeminateVerb(id) {
        if (hasConsonantEnding(id)) {
            return getSoundVerb(id);
        }
        else {
            return c.verb.letter1 + 'َ' + c.verb.letter2 + 'ّ' + helperData.endings[id - 1];
        }
    }

    // 1 - 4, 9, 10, 11, 13 have consonant endings
    function hasConsonantEnding(id) {
        if (_.includes([5,6,7,8,12], id)) {
            return false;
        }
        else {
            return true;
        }
    }

    return c;
})

