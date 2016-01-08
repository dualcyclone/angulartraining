(function(){
    var app = angular.module('contactsApp');

    var Contact = function($resource, $filter) {
        var self = $resource('https://codecraftpro.com/api/samples/v1/contact/:id/', {
            id:'@id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        function _getNextBirthday(date) {
            var today = new Date(),
                // Clone the birthday for modification
                birthday = new Date(date);

            // initialise the next birthday to be this year
            birthday.setYear(today.getFullYear());

            // If the birthday for this year has passed, change to next year
            if (birthday < today) {
                birthday.setYear(today.getFullYear() + 1);
            }

            return birthday;
        }

        angular.extend(self.prototype, {
            getBirthday: function() {
                var birthday = new Date(this.birthdate),
                    nextBirthday = _getNextBirthday(birthday),
                    daysUntilNextBirthday = Math.floor((nextBirthday.getTime() - (new Date().getTime())) / (86400000));

                return ($filter('date')(birthday, 'longDate') + (daysUntilNextBirthday < 28 ? ' (' + daysUntilNextBirthday + ' DAYS TIME!)' : ''));
            }
        });

        return self;
    };

    //Contact.$inject = ['$resource'];

    app.factory('Contact', Contact);
}());
