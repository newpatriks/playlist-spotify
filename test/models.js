
var assert = chai.assert;

describe('Models', function() {
    describe('ProfileModel', function () {
        var sut;
        var dispatcher;

        beforeEach(function() {
            dispatcher = sinon.stub({
                dispatch: function () {}
            });
            sut = new spotifyApp.ProfileModel(dispatcher);
        });

        afterEach(function() {
            sut = undefined;
            dispatcher = undefined;
        });

        it('should be empty when it starts', function () {
            assert.equal(sut.getAll().id, '');
        });

        it('should be able to add an item', function () {
            sut.setup('test');
            var profile = sut.getAll();
            assert.equal(profile.id, 'test');
        });

        it('should update the current location', function () {
            var location = {
                name: "Hawaii",
                abbreviation: "HI",
                capital: "Honolulu",
                lat: "21.30895",
                lon: "-157.826182"
            };
            sut.setCurrentLocation(location);

            var profile = sut.getAll();
            assert.typeOf(profile.currentLocation, 'object', 'location should be an object');
            assert.equal(profile.currentLocation.name, location.name, 'should contains the same name');
            assert.equal(profile.currentLocation.abbreviation, location.abbreviation, 'should contains the same abbreviation');
            assert.equal(profile.currentLocation.capital, location.capital, 'should contains the same capital');
            assert.equal(profile.currentLocation.lat, location.lat, 'should contains the same lat');
            assert.equal(profile.currentLocation.lon, location.lon, 'should contains the same lon');
        });

        it('should set the playlist ID', function () {
            var playlistId = '192769ayfiagsf2938yrt92ffa';
            sut.setPlaylistId(playlistId);

            var profile = sut.getAll();
            assert.equal(profile.playlistId, playlistId, 'should update the playlistId');
        });

        it('should fullfill genres', function () {
            sut.addGenre('soul');
            sut.addGenre('rock');
            sut.addGenre('hip-hop');

            var profile = sut.getAll();
            assert.equal(profile.genres.length, 3);
            assert.equal(profile.genres[0], 'soul');
        });

        it('should dispatch a render event after updating the model', function () {
            sut.setup('test');
            assert.ok(dispatcher.dispatch.withArgs(spotifyApp.events.RENDER).called, 'should dispatch render event');
        });
    });

    describe('GenresModel', function () {
        var sut;
        var dispatcher;

        beforeEach(function() {
            dispatcher = sinon.stub({
                dispatch: function () {}
            });
            sut = new spotifyApp.GenresModel(dispatcher);
        });

        afterEach(function() {
            sut = undefined;
            dispatcher = undefined;
        });

        it('should be empty when it starts', function () {
            assert.equal(sut.getAll().length, 0);
        });

        it('should add a list of genres', function () {
            var genres = ['soul', 'rock', 'salsa', 'deep-house'];
            sut.setup(genres);
            assert.equal(sut.getAll().length, genres.length);
            assert.equal(sut.getAll()[0], 'soul');
            assert.ok(dispatcher.dispatch.withArgs(spotifyApp.events.RENDER).called, 'should dispatch render event');
        });
    });

    describe('ArtistsModel', function () {
        var sut;

        beforeEach(function() {
            sut = new spotifyApp.ArtistsModel();
        });

        afterEach(function() {
            sut = undefined;
        });

        it('should be empty when it starts', function () {
            assert.equal(sut.getAll().length, 0);
        });

        it('should add an element', function () {
            sut.add('some id', 'some name');
            assert.equal(sut.getAll()[0].id, 'some id');
            assert.equal(sut.getAll()[0].name, 'some name');
        });

        it('should remove an element', function () {
            sut.add('some id', 'some name');
            assert.equal(sut.getAll()[0].id, 'some id');
            assert.equal(sut.getAll()[0].name, 'some name');

            sut.remove('some id');
            assert.equal(sut.getAll().length, 0);
        });

        it('should update a current artist', function () {
            sut.add('some id', 'some name');
            assert.equal(sut.getAll()[0].id, 'some id');
            assert.equal(sut.getAll()[0].name, 'some name');

            sut.update('some id', 'another name');
            assert.equal(sut.getAll()[0].name, 'another name');
        });

        it('should return the first artist on the array', function () {
            sut.add('id 1', 'name 1');
            sut.add('id 2', 'name 2');
            sut.add('id 3', 'name 3');
            sut.add('id 4', 'name 4');

            var artist = sut.getFirst();
            assert.equal(artist.name, 'name 1');
            assert.equal(artist.id, 'id 1');
            assert.typeOf(artist, 'object');
        });

        it('should return the next artist on the array', function () {
            sut.add('id 1', 'name 1');
            sut.add('id 2', 'name 2');
            sut.add('id 3', 'name 3');
            sut.add('id 4', 'name 4');

            var artist = sut.getFirst();
            assert.equal(artist.id, 'id 1');

            artist = sut.getNext(artist.id);
            assert.equal(artist.id, 'id 2');
        });

        it('should return true if it is the last element', function() {
            sut.add('id 1', 'name 1');
            sut.add('id 2', 'name 2');
            sut.add('id 3', 'name 3');
            sut.add('id 4', 'name 4');

            assert.isFalse(sut.isLast('id 1'));
            assert.isTrue(sut.isLast('id 4'));
        });
    });

    describe('TracksModel', function () {
        var sut;

        beforeEach(function() {
            sut = new spotifyApp.TracksModel();
        });

        afterEach(function() {
            sut = undefined;
        });

        it('should be empty when it starts', function () {
            assert.equal(sut.getAll().length, 0);
        });

        it('should add a new track', function () {
            var track = {
                id: 'some id'
            };
            sut.add(track);
            assert.equal(sut.getAll().length, 1);
            assert.equal(sut.getAll()[0].id, 'some id');
        });
    });

    describe('EventsModel', function () {
        var sut;

        beforeEach(function() {
            sut = new spotifyApp.EventsModel();
        });

        afterEach(function() {
            sut = undefined;
        });

        it('should be empty when it starts', function () {
            assert.equal(sut.getAll().length, 0);
        });

        it('should be able to add a list of events', function () {
            var event_1 = { name: 'event 1' };
            var event_2 = { name: 'event 2' };
            var event_3 = { name: 'event 3' };
            sut.setup([event_1, event_2, event_3]);
            assert.equal(sut.getAll().length, 3);
        });

        it('should add a new event', function () {
            var event = {
                name: 'some event name'
            };
            sut.add(event);
            assert.equal(sut.getAll().length, 1);
            assert.equal(sut.getAll()[0].name, 'some event name');
        });
    });


});
