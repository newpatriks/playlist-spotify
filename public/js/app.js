var spotifyApp = window.spotifyApp || {};

(function( window ) {

	'use strict';

	spotifyApp.SpotifyApp = soma.Application.extend({

		init: function() {

            this.injector.mapClass('profileModel', spotifyApp.ProfileModel, true);
            this.injector.mapClass('genresFullListModel', spotifyApp.GenresFullListModel, true);
            this.injector.mapClass('artistsModel', spotifyApp.ArtistsModel, true);
            this.injector.mapClass('eventsModel', spotifyApp.EventsModel, true);
            this.injector.mapClass('statesModel', spotifyApp.StatesModel, true);
            this.injector.mapClass('tracksModel', spotifyApp.TracksModel, true);

            this.injector.mapClass('geolocationService', spotifyApp.GeolocationService, true);
            this.injector.mapClass('songkickService', spotifyApp.SongkickService, true);
            this.injector.mapClass('spotifyService', spotifyApp.SpotifyService, true);

			this.commands.add(spotifyApp.events.RENDER, spotifyApp.AppCommand );
			this.commands.add(spotifyApp.events.LOGIN, spotifyApp.AppCommand );
			this.commands.add(spotifyApp.events.UPDATE_PROFILE, spotifyApp.AppCommand );
			this.commands.add(spotifyApp.events.UPDATE_CURRENT_LOCATION, spotifyApp.AppCommand );
			this.commands.add(spotifyApp.events.UPDATE_GENRES_FULL, spotifyApp.AppCommand );
			this.commands.add(spotifyApp.events.ADD_PROFILE_GENRE, spotifyApp.AppCommand );
			this.commands.add(spotifyApp.events.HANDLE_GENERATE_PLAYLIST, spotifyApp.AppCommand );
			this.commands.add(spotifyApp.events.TRACKS_READY, spotifyApp.AppCommand );

			this.createTemplate( spotifyApp.Template, document.getElementById( 'spotify-app' ) );

		},

		start: function() {
            var that = this;

            $('#login').show();
            $('#loggedin').hide();

            function getHashParams() {
                var hashParams = {};
                var e;
                var r = /([^&;=]+)=?([^&;]*)/g;
                var q = window.location.hash.substring(1);

                while (e = r.exec(q)) {
                    hashParams[e[1]] = decodeURIComponent(e[2]);
                }
                return hashParams;
            }

            var params = getHashParams();
            var access_token = spotifyApp.access_token = params.access_token;
            var refresh_token = params.refresh_token;
            var error = params.error;

			var profileModel = this.injector.getValue('profileModel');
			var genresFullListModel = this.injector.getValue('genresFullListModel');

            var spotifyService = this.injector.getValue('spotifyService');
            var geolocationService = this.injector.getValue('geolocationService');

            if (error) {
                alert('There was an error during the authentication');
            } else {
                if (access_token) {
                    spotifyService.getProfile(access_token).then(function(response) {

                        $('#login').hide();
                        $('#loggedin').show();

                        that.dispatcher.dispatch(spotifyApp.events.UPDATE_PROFILE, response);

                    }, function(err) {
                        console.log(err);
                    });

                    spotifyService.getGenres(access_token).then(function(response) {
                        that.dispatcher.dispatch(spotifyApp.events.UPDATE_GENRES_FULL, response.genres);

					}, function(err) {
                        console.log(err);
                    });

                } else {
                    // render initial screen
                    $('#login').show();
                    $('#loggedin').hide();
                }

            }

		}

	});

	var app = new spotifyApp.SpotifyApp();

})( window );
