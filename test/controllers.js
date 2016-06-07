describe('Controllers', function() {
    var sut;
    var dispatcher;
    var event;
    var profileModel;
    var genresModel;
    var artistsModel;
    var statesModel;
    var eventsModel;
    var tracksModel;
    var modalModel;
    var spotifyService;
    var songkickService;

    beforeEach(function() {
        event = sinon.stub({

        });
        profileModel = sinon.stub({
            setup: function() {},
            addGenre: function() {}
        });
        genresModel = sinon.stub({
            setup: function() {},
            getAll: function() {}
        });
        artistsModel = sinon.stub({
            getAll: function() {},
            getFirst: function() {},
            getNext: function() {},
            remove: function() {}
        });
        statesModel = sinon.stub({

        });
        eventsModel = sinon.stub({

        });
        tracksModel = sinon.stub({

        });
        modalModel = sinon.stub({
            update: function(){}
        });
        spotifyService = sinon.stub({

        });
        songkickService = sinon.stub({
            getEventsByArtist: function () {}
        });
        dispatcher = sinon.stub({
            dispatch: function () {}
        });

        sut = new spotifyApp.AppCommand(event, dispatcher, profileModel, genresModel, artistsModel, statesModel, eventsModel, tracksModel, modalModel, spotifyService, songkickService);
    });

    afterEach(function() {
        sut = undefined;
        event = undefined;
        dispatcher = undefined;
        profileModel = undefined;
        genresModel = undefined;
        artistsModel = undefined;
        statesModel = undefined;
        eventsModel = undefined;
        tracksModel = undefined;
        modalModel = undefined;
        spotifyService = undefined;
        songkickService = undefined;
    });

    it('should send the profile data to the model', function () {
        var profile = {
            'id': 'some id',
            'display_name': 'some name',
            email: 'some@email.com',
            images: [{'url': 'some url'}],
            country: 'some country'
        };
        var event = {
            type: spotifyApp.events.UPDATE_PROFILE,
            params: profile
        };
        sut.execute(event);

        assert.ok(profileModel.setup.withArgs(profile.id, profile.display_name, profile.email, profile.images[0].url, profile.country).calledOnce);
    });

    it('should send the genres data to the model', function () {
        var genres = ['genre 1', 'genre 2', 'genre 3', 'genre 4', 'genre 5', 'genre 6', 'genre 7'];
        var event = {
            type: spotifyApp.events.UPDATE_GENRES_FULL,
            params: genres
        };
        sut.execute(event);

        assert.ok(genresModel.setup.withArgs(genres).calledOnce);
    });

    it('should send the genres choosen to the profile model', function () {
        var genres = ['genre 1', 'genre 2', 'genre 3', 'genre 4', 'genre 5', 'genre 6', 'genre 7'];
        var event = {
            type: spotifyApp.events.ADD_PROFILE_GENRE,
            params: genres
        };
        sut.execute(event);

        assert.ok(profileModel.addGenre.withArgs(genres).calledOnce);
    });

    it('should remove artists that are not currently on tour', function () {
        var event = {
            type: spotifyApp.events.ARTISTS_CURRENTLY_ON_TOUR_UPDATED,
            params: artists
        };

        var artists = [];
        var artist_1 = { id: 'id 1', name: 'name 1', songkickMbid: '', onTour: false, eligible: false};
        var artist_2 = { id: 'id 2', name: 'name 2', songkickMbid: '', onTour: true, eligible: true};
        artists.push(artist_1);
        artists.push(artist_2);
        artistsModel.getAll.returns(artists);
        artistsModel.getFirst.returns(artists[0]);
        songkickService.getEventsByArtist.returns({
            then: function() {}
        });

        sut.execute(event);

        assert.ok(artistsModel.remove.withArgs(artist_1.id).calledOnce);
    });
});
