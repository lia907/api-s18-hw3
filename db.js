/**
 * Created by shawnmccarthy on 1/22/17.
 */
'use strict;';

var mongoose = require('mongoose');
mongoose.connect('mongodb://apihw3:api@ds249418.mlab.com:49418/ucd-api-s18-hw3');

var movieSchema = new mongoose.Schema(
    {
        title: String,
        year: Number,
        genre: {type: String, enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
            'Mystery', 'Thriller', 'Western']},
        actors: [{name: String, character: String}]
    }
);

var userSchema = new mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        fullname: {type: String, required: true},
        password: {type: String, required: true}
    }
);

var User = mongoose.model("User", userSchema);
var Movie = mongoose.model("Movie", movieSchema);

//Include crypto to generate the movie id
var crypto = require('crypto');
module.exports = function () {
    return {
        /*
         * Save the user inside the users table.
         */
        saveUser: function (user) {
            //check for duplicates
            if(findUser(user.username) === null){
                var newUser = User(
                    {
                        username: user.username,
                        fullname: user.fullname,
                        password: user.password
                    }
                );

                //user.password = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
                newUser.save(function(err){
                    if (err) throw err;
                    console.log("Sign-Up Success");
                    });
                return 1;
            }
            else{
                return 0;
            }

        },
        findUser: function (name) {
            if(name){
                var foundUser = User.find({username: name}, function(err, user){
                    if(err) throw err;
                    console.log(user);
                });
                return foundUser;
            }
            else {
                return null;
            }
        },
        /*
         * Retrieve a movie with a given title or return all the movies if the title is undefined.
         */
        findMovie: function (title) {
            if (title) {
                var foundMovie = Movie.find({title: title}, function(err, movie){
                    if(err) throw err;
                    console.log(movie);
                });
                return foundMovie;
            }
            else {
                return Movie.find(function(err, movie){
                    if(err) throw err;
                    console.log(movie);
                });
            }
        },
        findOneMovie: function (title){
            if(title){
                var foundMovie = Movie.find({title: title}, function(err, movie){
                    if (err) throw err;
                    console.log(movie);
                });
                return foundMovie;
            }
            else{
                return 0;
            }
        }
        /*
         * Delete a movie with the given title.
         */
        removeMovie: function (title) {
            var found = 0;
            Movie.find({title: title}, function(err, movie){
                if (err) throw err;
                movie.remove(function(err){
                    if (err) throw err;
                    console.log("Delete Movie Successful");
                    found = 1;
                });
            });
            return found;
        },
        /*
         * Update a movie
         */
        updateMovie: function (newmovie) {
            if (newmovie) {
                var fixMovie = Movie(
                    {
                        title: movie.title
                        year: movie.year
                        genre: movie.genre,
                        actors: movie.actors
                    }
                )
                Movie.find({title: movie.title}, function(err, movie){
                    if err throw err;

                    movie.title = newmovie.title;
                    movie.year = newmovie.year;
                    movie.genre = newmovie.genre;
                    movie.actors = newmovie.actors;

                    movie.save(function(err){
                        if err throw err;
                        console.log("Update Movie Successful");
                    });
                });
                return 1;
            }
            else {
                return 0;
            }
        }
    };
};