var spotifyApp = window.spotifyApp || {};

(function( window ) {

	'use strict';

    var ENTER_KEY = 13;

	spotifyApp.Template = function(scope, template, dispatcher, genresModel, profileModel, statesModel, modalModel) {

		dispatcher.addEventListener(spotifyApp.events.RENDER, function( event ) {

            var profile = profileModel.getAll();
            var genres = genresModel.getAll();
			var states = statesModel.getAll();
			var currentModelMessage = modalModel.getCurrentMessage();

			console.log(currentModelMessage);

            scope.username = profile.name;
            scope.userimage = profile.image;
            scope.genres = profile.genres;
            scope.genresFullList = genres;
			scope.states = states;
			scope.modalMessage = currentModelMessage;

            if (scope.genres.length >= 3) {
                // enable button
                var element = window.document.getElementById('generate-playlist__button');
                element.classList.remove('disabled');
            }

			template.render();

		}.bind( this ));

        scope.login = function(ev) {
            dispatcher.dispatch(spotifyApp.events.LOGIN);
        };

        scope.addGenre = function(event) {
			var value = event.currentTarget.value.trim();
			if ( event.which === ENTER_KEY && value !== '' ) {
				dispatcher.dispatch(spotifyApp.events.ADD_PROFILE_GENRE, value);
				event.currentTarget.value = '';
			}
		};

		scope.updateCurrentLocation = function(event) {
			var selectedElement = event.target.selectedOptions[0];
			dispatcher.dispatch(spotifyApp.events.UPDATE_CURRENT_LOCATION, selectedElement.value);

		};

        scope.generatePlaylist = function() {
            dispatcher.dispatch(spotifyApp.events.HANDLE_GENERATE_PLAYLIST);
        };

	};

})( window );
