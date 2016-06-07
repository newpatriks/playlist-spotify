var spotifyApp = window.spotifyApp || {};

(function( window ) {

	'use strict';

    // PROFILE MODEL
    spotifyApp.ProfileModel = function(dispatcher) {
		this.dispatcher = dispatcher;
        this.profile = {
			'id': '',
            'name': '',
            'email': '',
            'image': '',
            'country': '',
			'playlistId': '',
            'currentLocation': {},
			'genres': []
        };

    };
    spotifyApp.ProfileModel.prototype = {
        setup: function(u_id, u_display_name, u_email, u_images, u_country) {
			this.profile.id = u_id;
            this.profile.name = u_display_name;
            this.profile.email = u_email;
            this.profile.image = u_images;
            this.profile.country = u_country;
			this.update();
        },
        setCurrentLocation: function(location) {
            this.profile.currentLocation = location;
			this.update();
        },
		setPlaylistId: function(playlistId) {
			this.profile.playlistId = playlistId;
		},
		addGenre: function(genre) {
			if (this.profile.genres.length < 5 && this.profile.genres.indexOf(genre) === -1) {
				this.profile.genres.push(genre);
				this.update();
			}
		},
        getAll: function() {
            return this.profile;
        },
		update: function() {
			this.dispatcher.dispatch(spotifyApp.events.RENDER);
		}
    };

	spotifyApp.GenresModel = function(dispatcher) {
		this.dispatcher = dispatcher;
		this.genres = [];
	};

	spotifyApp.GenresModel.prototype = {
			setup: function(data) {
				this.genres = data;
				this.update();
			},
			getAll: function() {
				return this.genres;
			},
			update: function() {
				this.dispatcher.dispatch(spotifyApp.events.RENDER);
			}
	};

	spotifyApp.ArtistsModel = function() {
		this.artists = [];
	};
	spotifyApp.ArtistsModel.prototype = {
		add: function(artistId, artistName) {
			var artist = {
				'id': artistId,
				'name': artistName,
				'songkickMbid': '',
				'onTour': false,
				'eligible': false
			};
			for (var i=0; i < this.artists.length; i++) {
		        if (this.artists[i].id === artistId) {
		            return;
		        }
		    }
			this.artists.push(artist);
		},
		remove: function(artistId) {
			for (var i=0; i < this.artists.length; i++) {
		        if (this.artists[i].id === artistId) {
					this.artists.splice(i, 1);
					return;
				}
			}
		},
		update: function(id, name, songkickMbid, onTour, eligible) {
			for (var i=0; i < this.artists.length; i++) {
				var artist = this.artists[i];
		        if (artist.id === id) {
					this.artists[i].name = name ? name : this.artists[i].name;
					this.artists[i].songkickMbid = songkickMbid ? songkickMbid : this.artists[i].songkickMbid;
					this.artists[i].onTour = onTour ? onTour : this.artists[i].onTour;
					this.artists[i].eligible =  eligible ? eligible : this.artists[i].eligible;
				}
			}
		},
		getFirst: function() {
			return this.artists[0];
		},
		getNext: function(artistId) {
			for (var i=0; i < this.artists.length; i++) {
		        if (this.artists[i].id === artistId) {
					return i < this.artists.length - 1 ? this.artists[i + 1] : null;
		        }
		    }
		},
		getAll: function() {
			return this.artists;
		},
		isLast: function(artistId) {
			for (var i=0; i < this.artists.length; i++) {
		        if (this.artists[i].id === artistId) {
					return i === (this.artists.length - 1);
		        }
		    }
		}
	};

	spotifyApp.TracksModel = function() {
		this.tracks = [];
	};
	spotifyApp.TracksModel.prototype = {
		add: function(track) {
			if (this.tracks.indexOf(track) < 0) {
				this.tracks.push(track);
			}
		},
		getAll: function() {
			return this.tracks;
		}
	};

	spotifyApp.EventsModel = function() {
		this.events = [];
	};
	spotifyApp.EventsModel.prototype = {
		setup: function(events) {
			this.events = events;
		},
		add: function(event) {
			for (var i=0; i < this.events.length; i++) {
		        if (this.events[i].id === event.id) {
		            return;
		        }
		    }
			this.events.push(event);
		},
		getAll: function() {
			return this.events;
		}
	};

	spotifyApp.StatesModel = function() {
		this.states = [{
		  'name': 'Alabama',
		  'abbreviation': 'AL',
		  'capital': 'Montgomery',
		  'lat': '32.361538',
		  'lon': '-86.279118'
		}, {
		  'name': 'Alaska',
		  'abbreviation': 'AK',
		  'capital': 'Juneau',
		  'lat': '58.301935',
		  'lon': '-134.419740'
		}, {
		  'name': 'Arizona',
		  'abbreviation': 'AZ',
		  'capital': 'Phoenix',
		  'lat': '33.448457',
		  'lon': '-112.073844'
		}, {
		  'name': 'Arkansas',
		  'abbreviation': 'AR',
		  'capital': 'Little Rock',
		  'lat': '34.736009',
		  'lon': '-92.331122'
		}, {
		  'name': 'California',
		  'abbreviation': 'CA',
		  'capital': 'Sacramento',
		  'lat': '38.555605',
		  'lon': '-121.468926'
		}, {
		  'name': 'Colorado',
		  'abbreviation': 'CO',
		  'capital': 'Denver',
		  'lat': '39.7391667',
		  'lon': '-104.984167'
		}, {
		  'name': 'Connecticut',
		  'abbreviation': 'CT',
		  'capital': 'Hartford',
		  'lat': '41.767',
		  'lon': '-72.677'
		}, {
		  'name': 'Delaware',
		  'abbreviation': 'DE',
		  'capital': 'Dover',
		  'lat': '39.161921',
		  'lon': '-75.526755'
		}, {
		  'name': 'Florida',
		  'abbreviation': 'FL',
		  'capital': 'Tallahassee',
		  'lat': '30.4518',
		  'lon': '-84.27277'
		}, {
		  'name': 'Georgia',
		  'abbreviation': 'GA',
		  'capital': 'Atlanta',
		  'lat': '33.76',
		  'lon': '-84.39'
		}, {
		  'name': 'Hawaii',
		  'abbreviation': 'HI',
		  'capital': 'Honolulu',
		  'lat': '21.30895',
		  'lon': '-157.826182'
		}, {
		  'name': 'Idaho',
		  'abbreviation': 'ID',
		  'capital': 'Boise',
		  'lat': '43.613739',
		  'lon': '-116.237651'
		}, {
		  'name': 'Illinois',
		  'abbreviation': 'IL',
		  'capital': 'Springfield',
		  'lat': '39.783250',
		  'lon': '-89.650373'
		}, {
		  'name': 'Indiana',
		  'abbreviation': 'IN',
		  'capital': 'Indianapolis',
		  'lat': '39.790942',
		  'lon': '-86.147685'
		}, {
		  'name': 'Iowa',
		  'abbreviation': 'IA',
		  'capital': 'Des Moines',
		  'lat': '41.590939',
		  'lon': '-93.620866'
		}, {
		  'name': 'Kansas',
		  'abbreviation': 'KS',
		  'capital': 'Topeka',
		  'lat': '39.04',
		  'lon': '-95.69'
		}, {
		  'name': 'Kentucky',
		  'abbreviation': 'KY',
		  'capital': 'Frankfort',
		  'lat': '38.197274',
		  'lon': '-84.86311'
		}, {
		  'name': 'Louisiana',
		  'abbreviation': 'LA',
		  'capital': 'Baton Rouge',
		  'lat': '30.45809',
		  'lon': '-91.140229'
		}, {
		  'name': 'Maine',
		  'abbreviation': 'ME',
		  'capital': 'Augusta',
		  'lat': '44.323535',
		  'lon': '-69.765261'
		}, {
		  'name': 'Maryland',
		  'abbreviation': 'MD',
		  'capital': 'Annapolis',
		  'lat': '38.972945',
		  'lon': '-76.501157'
		}, {
		  'name': 'Massachusetts',
		  'abbreviation': 'MA',
		  'capital': 'Boston',
		  'lat': '42.2352',
		  'lon': '-71.0275'
		}, {
		  'name': 'Michigan',
		  'abbreviation': 'MI',
		  'capital': 'Lansing',
		  'lat': '42.7335',
		  'lon': '-84.5467'
		}, {
		  'name': 'Minnesota',
		  'abbreviation': 'MN',
		  'capital': 'Saint Paul',
		  'lat': '44.95',
		  'lon': '-93.094'
		}, {
		  'name': 'Mississippi',
		  'abbreviation': 'MS',
		  'capital': 'Jackson',
		  'lat': '32.320',
		  'lon': '-90.207'
		}, {
		  'name': 'Missouri',
		  'abbreviation': 'MO',
		  'capital': 'Jefferson City',
		  'lat': '38.572954',
		  'lon': '-92.189283'
		}, {
		  'name': 'Montana',
		  'abbreviation': 'MT',
		  'capital': 'Helana',
		  'lat': '46.595805',
		  'lon': '-112.027031'
		}, {
		  'name': 'Nebraska',
		  'abbreviation': 'NE',
		  'capital': 'Lincoln',
		  'lat': '40.809868',
		  'lon': '-96.675345'
		}, {
		  'name': 'Nevada',
		  'abbreviation': 'NV',
		  'capital': 'Carson City',
		  'lat': '39.160949',
		  'lon': '-119.753877'
		}, {
		  'name': 'New Hampshire',
		  'abbreviation': 'NH',
		  'capital': 'Concord',
		  'lat': '43.220093',
		  'lon': '-71.549127'
		}, {
		  'name': 'New Jersey',
		  'abbreviation': 'NJ',
		  'capital': 'Trenton',
		  'lat': '40.221741',
		  'lon': '-74.756138'
		}, {
		  'name': 'New Mexico',
		  'abbreviation': 'NM',
		  'capital': 'Santa Fe',
		  'lat': '35.667231',
		  'lon': '-105.964575'
		}, {
		  'name': 'New York',
		  'abbreviation': 'NY',
		  'capital': 'Albany',
		  'lat': '42.659829',
		  'lon': '-73.781339'
		}, {
		  'name': 'North Carolina',
		  'abbreviation': 'NC',
		  'capital': 'Raleigh',
		  'lat': '35.771',
		  'lon': '-78.638'
		}, {
		  'name': 'North Dakota',
		  'abbreviation': 'ND',
		  'capital': 'Bismarck',
		  'lat': '48.813343',
		  'lon': '-100.779004'
		}, {
		  'name': 'Ohio',
		  'abbreviation': 'OH',
		  'capital': 'Columbus',
		  'lat': '39.962245',
		  'lon': '-83.000647'
		}, {
		  'name': 'Oklahoma',
		  'abbreviation': 'OK',
		  'capital': 'Oklahoma City',
		  'lat': '35.482309',
		  'lon': '-97.534994'
		}, {
		  'name': 'Oregon',
		  'abbreviation': 'OR',
		  'capital': 'Salem',
		  'lat': '44.931109',
		  'lon': '-123.029159'
		}, {
		  'name': 'Pennsylvania',
		  'abbreviation': 'PA',
		  'capital': 'Harrisburg',
		  'lat': '40.269789',
		  'lon': '-76.875613'
		}, {
		  'name': 'Rhode Island',
		  'abbreviation': 'RI',
		  'capital': 'Providence',
		  'lat': '41.82355',
		  'lon': '-71.422132'
		}, {
		  'name': 'South Carolina',
		  'abbreviation': 'SC',
		  'capital': 'Columbia',
		  'lat': '34.000',
		  'lon': '-81.035'
		}, {
		  'name': 'South Dakota',
		  'abbreviation': 'SD',
		  'capital': 'Pierre',
		  'lat': '44.367966',
		  'lon': '-100.336378'
		}, {
		  'name': 'Tennessee',
		  'abbreviation': 'TN',
		  'capital': 'Nashville',
		  'lat': '36.165',
		  'lon': '-86.784'
		}, {
		  'name': 'Texas',
		  'abbreviation': 'TX',
		  'capital': 'Austin',
		  'lat': '30.266667',
		  'lon': '-97.75'
		}, {
		  'name': 'Utah',
		  'abbreviation': 'UT',
		  'capital': 'Salt Lake City',
		  'lat': '40.7547',
		  'lon': '-111.892622'
		}, {
		  'name': 'Vermont',
		  'abbreviation': 'VT',
		  'capital': 'Montpelier',
		  'lat': '44.26639',
		  'lon': '-72.57194'
		}, {
		  'name': 'Virginia',
		  'abbreviation': 'VA',
		  'capital': 'Richmond',
		  'lat': '37.54',
		  'lon': '-77.46'
		}, {
		  'name': 'Washington',
		  'abbreviation': 'WA',
		  'capital': 'Olympia',
		  'lat': '47.042418',
		  'lon': '-122.893077'
		}, {
		  'name': 'West Virginia',
		  'abbreviation': 'WV',
		  'capital': 'Charleston',
		  'lat': '38.349497',
		  'lon': '-81.633294'
		}, {
		  'name': 'Wisconsin',
		  'abbreviation': 'WI',
		  'capital': 'Madison',
		  'lat': '43.074722',
		  'lon': '-89.384444'
		}, {
		  'name': 'Wyoming',
		  'abbreviation': 'WY',
		  'capital': 'Cheyenne',
		  'lat': '41.145548',
		  'lon': '-104.802042'
		}];
	};

	spotifyApp.StatesModel.prototype = {
		get: function(stateAbbreviation) {
		    for (var i=0; i < this.states.length; i++) {
		        if (this.states[i].abbreviation === stateAbbreviation) {
		            return this.states[i];
		        }
		    }
		},
		getAll: function() {
			return this.states;
		}
	};

	spotifyApp.ModalModel = function(dispatcher) {
		this.dispatcher = dispatcher;
		this.messages = [
			'Starting to cook your playlist',
			'Filtering artists touring...',
			'Picking up the tracks...',
			'Your playlist is ready!'
		];
		this.subtitle = '';
		this.currentMessage = 0;
	};

	spotifyApp.ModalModel.prototype = {
		update: function(i) {
			this.currentMessage = i;
			this.dispatcher.dispatch(spotifyApp.events.RENDER);
		},
		updateMessage: function(value) {
			this.messages[this.currentMessage] = value;
			this.dispatcher.dispatch(spotifyApp.events.RENDER);
		},
		updateSubtitle: function(value) {
			this.subtitle = value;
			this.dispatcher.dispatch(spotifyApp.events.RENDER);
		},
		getSubtitle: function(value) {
			return this.subtitle;
		},
		getCurrentMessage: function() {
			return this.messages[this.currentMessage];
		}
	};


})( window );
