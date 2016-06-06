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
        'ARTISTS_CURRENTLY_ON_TOUR_UPDATED': 'artistsCurrentlyOnTourCompleted',
        'EVENTS_BY_ARTISTS_COMPLETED': 'eventsByArtistsCompleted',
        'TRACKS_READY': 'tracksReady'
	};

	spotifyApp.AppCommand = function(event, dispatcher, profileModel, genresModel, artistsModel, statesModel, eventsModel, tracksModel, modalModel, spotifyService, songkickService) {

		function insertArtists(artistResponse) {
			// update the artist model with all the artists from the tracks
			artistResponse.tracks.forEach(function(track) {
				var artists = track.artists;
				artists.forEach(function(artist) {
					artistsModel.add(artist.id, artist.name);
				});
			});
		}

		function parseArtistsData(artistsData) {
			if (artistsData.identifier && artistsData.identifier.length > 0 && artistsData.identifier[0].mbid) {
				var artistSongkick = {
					name: artistsData.displayName,
					songkickMbid: artistsData.identifier[0].mbid,
					onTour: artistsData.onTourUntil ? true : false
				};
				return artistSongkick;
			}
			else {
				return null;
			}
		}

		function updateEventsModel(artistId, eventsData) {
			eventsData.forEach(function(event) {
				var locationEvent = event.location.city.split(', ');
				if (locationEvent[2] === 'US') {
					var stateEvent = locationEvent[1];
					if (compareToCurrentLocationOfUser(stateEvent)) {
						artistsModel.setEligible(artistId);
					}
				}
			});
		}

		function nextArtist(artist, callback, event) {
			if (!artistsModel.isLast(artist.id)) {
				callback(artistsModel.getNext(artist.id));
			}
			else {
				dispatcher.dispatch(event);
			}
		}

		function setArtistInfoSongkickId(artist) {
			songkickService
				.getArtistName(artist.name)
				.then(function(artistResponse) {
					if (artistResponse.resultsPage.totalEntries > 0) {
						var data = parseArtistsData(artistResponse.resultsPage.results.artist[0]);
						if (data) {
							artistsModel.update(artist.id, null, data.songkickMbid, data.onTour);
						}
					}
					nextArtist(artist, setArtistInfoSongkickId, spotifyApp.events.ARTISTS_CURRENTLY_ON_TOUR_UPDATED);
				});
		}

		function getEventsByArtists(artist) {
			songkickService
				.getEventsByArtist(artist.songkickMbid)
				.then(function(eventResponse) {
					if (eventResponse.resultsPage.totalEntries > 0) {
						updateEventsModel(artist.id, eventResponse.resultsPage.results.event);
					}
					nextArtist(artist, getEventsByArtists, spotifyApp.events.EVENTS_BY_ARTISTS_COMPLETED);
				});
		}

		function topTracksByArtist(artist) {
			spotifyService
				.topTracksByArtist(artist.id)
				.then(function(trackResponse) {
					var tracks = trackResponse.tracks;
					for (var i = 0, j = Math.min(2, tracks.length); i < j; i++) {
						tracksModel.add(tracks[i].uri);
					}
					nextArtist(artist, topTracksByArtist, spotifyApp.events.TRACKS_READY);
				});
		}

		function filterArtistsModelCurrentlyTouring() {
			// remove all artists who are not touring
			var artists = artistsModel.getAll();
			// return artists.filter(function(artist) {
			// 	return artist.onTour === true;
			// });
			for (var i = artists.length - 1; i > 0; i--) {
				var artist = artists[i];
				if (!artist.onTour) {
					artistsModel.remove(artist.id);
				}
			}
		}

		function compareToCurrentLocationOfUser(stateEvent) {
			var profileLocation = profileModel.getAll().currentLocation;
			if (profileLocation.abbreviation === stateEvent) {
				return true;
			}
			else {
				return false;
			}
		}

		function enableTypeahead() {
			$('.typeahead').typeahead({
				source: genresModel.getAll()
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
                    genresModel.setup(data);
					enableTypeahead();
					break;

                case spotifyApp.events.ADD_PROFILE_GENRE:
                    data = event.params;
                    profileModel.addGenre(data);
					break;

				case spotifyApp.events.ARTISTS_CURRENTLY_ON_TOUR_UPDATED:
					// var artists = filterArtistsModelCurrentlyTouring();
					modalModel.update(1);
					filterArtistsModelCurrentlyTouring();
					getEventsByArtists(artistsModel.getFirst());


					break;

				case spotifyApp.events.EVENTS_BY_ARTISTS_COMPLETED:
					modalModel.update(2);
					var profile = profileModel.getAll();
					spotifyService
						.createPlaylist(profile.id, 'My next events list')
						.then(function(response) {
							profileModel.setPlaylistId(response.id);
								var finalArtists = artistsModel.getAll().filter(function(artist) {
									return artist.eligible;
								});
								topTracksByArtist(artistsModel.getFirst());
						});


					break;

				case spotifyApp.events.TRACKS_READY:
					spotifyService
						.addTracks(profileModel.getAll().id, profileModel.getAll().playlistId, tracksModel.getAll())
						.then(function(response) {
							modalModel.update(3);
						});

					break;

                case spotifyApp.events.HANDLE_GENERATE_PLAYLIST:
                    var profileGenres = profileModel.getAll().genres;
                    spotifyService
						.recommendationsByGenre(profileGenres)
						.then(function(response) {
							$('#myModal').modal('show');
							insertArtists(response);
							setArtistInfoSongkickId(artistsModel.getFirst());
						});

					break;

                case spotifyApp.events.UPDATE_CURRENT_LOCATION:
					var stateObject = statesModel.get(event.params);
                	profileModel.setCurrentLocation(stateObject);
					break;
			}
		};
	};

})( window );
