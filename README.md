# Playlist creator
The app creates a playlist from bands related to the genres selected and also bands that will play in the State picked by the user as well. This application uses your Spotify credentials to log in, and it generates a playlist to your profile.

You can give it a try <a href="http://upcoming-concert-playlist.herokuapp.com">here</a>.

## How to

After download and unzip the project inside a folder, go to the projects folder and using the terminal type the next command to install all the dependencies:

```
npm install
```

When the installation finishes, we need to run the node server for the app:

```
node app
```

Now we are able to see the app just going to the URL: ```http://localhost:8888```

After log in in using your Spotify account you can **choose a location** (US state) and **between three and five genres** (press enter key to add a new genre).

All the production files are inside of the /public folder apart from the node application file (app.js) that is on the root of the projects folder.


## Technologies

To develop the app I used mainly vanilla javascript. To be able to order my code using **MVC** paradigm and use some patterns such us *mediator-pattern* or *command-pattern* I use the library <a href="http://somajs.github.io/somajs/site/#what-is-soma-js">somajs</a>

For the OAUTH authentication I followed the examples of <a href="https://github.com/JMPerez/spotify-web-api-js">@JMPerez</a> built using ```Nodejs``` with ```Express```.

For the css I use ```sass```. To precompile the files I am using ```grunt``` and the watch task. Also, I use grunt to minify the css files.

For the grids and the look and feel of the app I use ```bootstrap 3```. I use it for the responsiveness as well. 

I have some unit tests for the app (mainly for the models and the controller). These unit tests has been developed using ```mocha```, ```chai``` and ```sinon```.

## Testing

To run the tests you need to do it on the browser, just launching the url of the tests itself. 
