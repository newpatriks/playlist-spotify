#Playlist creator


##How to

After download and unzip the project inside a folder, go to the projects folder and using the terminal type the next command to install all the dependencies:

```
npm install
```

When the installation finishes, we need to run the node server for the app:

```
node app
```

Now we are able to see the app just going to the URL: ```http://localhost:8888```

All the production files are inside of the /public folder apart from the node application file (app.js) that is on the root of the projects folder.


##Technologies

To develope the app I used mainly vanilla javascript. To be able to order my code using **MVC** paradigm and use some patterns such us *mediator-pattern* or *command-pattern* I use the library <a href="http://somajs.github.io/somajs/site/#what-is-soma-js">somajs</a>

For the OAUTH authentication I followed the examples of <a href="https://github.com/JMPerez/spotify-web-api-js">@JMPerez</a> built using ```Nodejs``` with ```Express```.

For the css I use ```sass```. To precompile the files I am using ```grunt``` and the watch task. Also, I use grunt to minify the css files.

For the grids and the look and feel of the app I use ```bootstrap 3```. I use it for the responsiveness as well. 

I have some unit tests for the app (mainly for the models and the controller). These unit tests has been developed using ```mocha```, ```chai``` and ```sinon```.

##Testing

To run the tests you need to do it on the browser, just launching the url of the tests itself. 