var spotifyApp = window.spotifyApp || {};

(function( window ) {

	'use strict';

	spotifyApp.events = {
		'RENDER': 'render',
        'LOGIN': 'login',
        'UPDATE_GENRES_FULL': 'updateGenresFull',
        'UPDATE_CURRENT_LOCATION': 'updateCurrentLocation',
        'UPDATE_PROFILE': 'updateProfile',
        'ADD_PROFILE_GENRE': 'addProfileGenre',
        'HANDLE_GENERATE_PLAYLIST': 'handleGeneratePlaylist',
        'TRACKS_READY': 'tracksReady'
	};

	spotifyApp.AppCommand = function(event, profileModel, genresFullListModel, artistsModel, statesModel, eventsModel, tracksModel, spotifyService, songkickService) {

		function insertArtists(artistResponse) {
			// update the artist model with all the artists from the tracks
			artistResponse.tracks.forEach(function(track) {
				var artists = track.artists;
				artists.forEach(function(artist) {
					artistsModel.add(artist.id, artist.name);
				});
			});
		}

		function updateArtistOnTour() {

			var artists = artistsModel.getAll();
			for (var i = 0, j = artists.length; i < j; i++) {
			// for (var i = 0, j = 10; i < j; i++) {
				(function(i) {
					songkickService
						.getArtistName(artists[i].name)
						.then(function(artistResponse) {
							if (artistResponse.resultsPage && artistResponse.resultsPage.results && artistResponse.resultsPage.results.artist && artistResponse.resultsPage.results.artist[0]) {
								var currentArtistProfile = artistResponse.resultsPage.results.artist[0];
								if (currentArtistProfile.onTourUntil) {
									var mbid = (currentArtistProfile.identifier && currentArtistProfile.identifier[0] && currentArtistProfile.identifier[0].mbid) ? currentArtistProfile.identifier[0].mbid : '';
									artistsModel.updateArtistOnTour(artists[i].id, mbid);
								}
							}

							if (i === j - 1)
								filterArtistTouringByLocation();

						}, function(err) {
							console.log(err);
						});
				})(i);
			}
		}

		function filterArtistTouringByLocation() {
			var artistsProfileOnTour = [];
			var totalArtist = artistsModel.getAll();
			// filter artist by who's currently on tour
			artistsProfileOnTour = totalArtist.filter(function(el) { return el.onTour; });
			artistsProfileOnTour.forEach(function(artist) {
				songkickService
					.getEventsByArtist(artist.mbid)
					.then(function(response) {
						if (response.resultsPage && response.resultsPage.results && response.resultsPage.results.event) {
							var events = response.resultsPage.results.event;
							for (var i = 0, j = events.length; i < j; i++) {
								var locationEvent = events[i].location.city.split(', ');
								if (locationEvent[2] === 'US') {
									var stateEvent = locationEvent[1];
									if (compareToCurrentLocation(stateEvent)) {
										artistsModel.setEligible(artist.id);
									}
								}
							}
						}
					});
			});
		}

		function compareToCurrentLocation(stateEvent) {
			var profileLocation = profileModel.getAll().currentLocation;
			if (profileLocation.abbreviation === stateEvent) {
				return true;
			}
			else {
				return false;
			}
		}

		function setUpGenres() {
			$('.typeahead').typeahead({
				source: genresFullListModel.getAll()
			});
		}

		this.execute = function( event ) {
            var data;

			switch( event.type ) {
				case spotifyApp.events.LOGIN:
					break;

                case spotifyApp.events.UPDATE_PROFILE:
                    data = event.params;
                    profileModel.setup(data.id, data.display_name, data.email, data.images[0].url, data.country);
					break;

                case spotifyApp.events.UPDATE_GENRES_FULL:
                    data = event.params;
                    genresFullListModel.setup(data);
					setUpGenres();
					break;

                case spotifyApp.events.ADD_PROFILE_GENRE:
                    data = event.params;
                    profileModel.addGenre(data);
					break;

                case spotifyApp.events.HANDLE_GENERATE_PLAYLIST:
                    var profileGenres = profileModel.getAll().genres;
                    spotifyService
						.recommendationsByGenre(profileGenres)
						.then(insertArtists)
						.then(updateArtistOnTour);


					setTimeout(function() {
						// create playlist
						var profile = profileModel.getAll();
						spotifyService
							.createPlaylist(profile.id, 'My next events list')
							.then(function(response) {
								var data = response;
								profileModel.setPlaylistId(data.id);

								var finalArtists = artistsModel.getAll().filter(function(artist) {
									return artist.eligible;
								});

								for (var x = 0, h = finalArtists.length; x < h; x++) {
									(function(x) {
										var artist = finalArtists[x];
										spotifyService
											.topTracksByArtist(artist.id)
											.then(function(response) {
												var tracks = response.tracks;
												for (var i = 0, j = Math.min(2, tracks.length); i < j; i++) {
													tracksModel.add(tracks[i].uri);
												}
												if (x >= finalArtists.length-1)
													spotifyService
														.addTracks(profileModel.getAll().id, profileModel.getAll().playlistId, tracksModel.getAll())
														.then(function(response) {
															$('#myModal').modal('show');
														}, function(err) {

														});
											});
									})(x);
								}
						});

					}, 4000);

					break;

                case spotifyApp.events.UPDATE_CURRENT_LOCATION:
					var stateObject = statesModel.get(event.params);
                	profileModel.setCurrentLocation(stateObject);
					break;
			}
		};
	};

})( window );
