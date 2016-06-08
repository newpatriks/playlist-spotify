var spotifyApp = window.spotifyApp || {};

(function( window ) {

	'use strict';

	spotifyApp.GeolocationService = function() {

	};
	spotifyApp.GeolocationService.prototype.get = function(lat, lon) {
		return reqwest({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon,
			crossOrigin: true
		});
	};

	spotifyApp.SpotifyService = function() {

	};

	spotifyApp.SpotifyService.prototype = {
		getProfile: function(access_token) {
	        return reqwest({
	            url: 'https://api.spotify.com/v1/me',
	            crossOrigin: true,
	            headers: {
	              'Authorization': 'Bearer ' + access_token
	            }
	        });
	    },
		getGenres: function(access_token) {
	        return reqwest({
	            url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
	            crossOrigin: true,
	            headers: {
	              'Authorization': 'Bearer ' + access_token
	            }
	        });
		},
		recommendationsByGenre: function(genres) {
	        return reqwest({
	            url: 'https://api.spotify.com/v1/recommendations?seed_genres='+genres.toString()+'&limit=50',
	            crossOrigin: true,
	            headers: {
	              'Authorization': 'Bearer ' + spotifyApp.access_token
	            }
	        });
	    },
		topTracksByArtist: function(artistId) {
			return reqwest({
				url: 'https://api.spotify.com/v1/artists/'+ artistId +'/top-tracks?country=US',
				crossOrigin: true,
				headers: {
				  'Authorization': 'Bearer ' + spotifyApp.access_token
				}
			});
		},
		createPlaylist: function(userId, playlistName) {
			return reqwest({
				url: 'https://api.spotify.com/v1/users/'+userId+'/playlists',
				crossOrigin: true,
				type: 'json',
				method: 'post',
				contentType: 'application/json',
				headers: {
					'Authorization': 'Bearer ' + spotifyApp.access_token
				},
				data: JSON.stringify({ "name": playlistName })
			});
		},
		addTracks: function(userId, playlistId, trackList) {
			return reqwest({
				url: 'https://api.spotify.com/v1/users/'+userId+'/playlists/'+playlistId+'/tracks?uris='+trackList.toString(),
				crossOrigin: true,
				type: 'json',
				method: 'post',
				contentType: 'application/json',
				headers: {
					'Authorization': 'Bearer ' + spotifyApp.access_token
				}
			});
		}

	};

	spotifyApp.SongkickService = function() {
		this.songkickApiKey = 'io09K9l3ebJxmxe2';
		this.appName = 'spotifyApp';
	};
	spotifyApp.SongkickService.prototype = {
		get: function(url) {
			return reqwest({
				url: url + '&apikey=' + this.songkickApiKey+'&jsoncallback=?',
				crossOrigin: true
			});
		},
		getArtistName: function(artist) {
			return reqwest({
				url: 'https://api.songkick.com/api/3.0/search/artists.json?query='+ artist +'&apikey='+this.songkickApiKey+'&jsoncallback=?',
				crossOrigin: true,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
					'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'

				}
			});
		},
		getEventsByLocation: function(artist, lat, lon) {
			return reqwest({
				url: 'https://api.songkick.com/api/3.0/events.json?apikey='+this.songkickApiKey+'&artist='+artist+'&location=geo:'+lat+','+lon+'&jsoncallback=?',
				crossOrigin: true
			});
		},
		getEventsByArtist: function(artist) {
			return reqwest({
				url: 'https://api.songkick.com/api/3.0/artists/mbid:'+ artist +'/calendar.json?apikey='+this.songkickApiKey+'&jsoncallback=?',
				crossOrigin: true
			});
		}
	};


})( window );
