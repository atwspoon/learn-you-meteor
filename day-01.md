# Day 1 - Install & Templates

## Meteor?

Meteor is a full-stack JavaScript framework for building real-time web
applications. It touts having a consistent interface for working with your data
whether you're on the client side or the server side.

It's definitely a beast of it's own, as in, there's not much out there quite
like meteor. It's unique take on web application development provides something
that is both very productive and enjoyable for the developer.

## Tweeteor! -- Our example application

The example application we will be building along the way is called Tweeteor.
It's a very stripped-down Twitter clone. The features are:

1. View all global tweets
2. Create an account
3. Post new tweets
4. Edit and delete your own tweets
5. Seach for tweets

We will also see how to deploy this application.

## Installation

To install Meteor, copy the following into your command line:

```
$ curl https://install.meteor.com/ | sh
```

If you are on Windows, you will need to download the installer
[here](meteor-windows-installer).

You now have the meteor command line utility installed and ready to get started.
To see what all is available with this too, run `meteor --help`. There's quite a
bit, but don't worry, we'll cover what we need as we go along.

## Creating a project

To create a new project will use the newly acquired Meteor CLI. The command to
create a new project is:

```
$ meteor create tweeteor
```

It will create a new folder in the directory you are currently in with the name
of the project you provided. In there you will find 3 files:

```
tweeteor.css
tweeteor.html
tweeteor.js
```

Each will contain minor boilerplate code. You will notice in the `.js` file that
there are two main `if` statements, `if (Meteor.isClient)` and `if
(Meteor.isServer)`, showing you that your server and client side code are
coupled together. This is one way that meteor differentiates from many other
frameworks. We'll see how this can be advantageous going forward.

## Starting the server

Now that we have a project generated, let's start up the server and see it in
action. Open up your terminal at the location of your project and enter the
following command:

```
$ meteor
```

That's it! Your application should now be available at `http://localhost:3000`.

Meteor automatically watches the files in your project folder and will restart
things when you make changes. Now we can start coding and see our project update
itself in real time.

## Template files

The first thing we're going to look at is our template file. This is the `.html`
file that is in your project directory. You should noticed it doesn't look like
a typical HTML file since it's missing the doctype and the surrounding HTML tag.
Outside of that, it's largely the same.

Inside our `body` tag you will see some code like so:

```
{{> hello}}
```

This is meteor's way of including a template defined elsewhere. This is a way of
wrapping particular "components" on your page with their own set of behaviors
and interactions. This is how we will be organizing the pieces of our
applciation.

Further down, outside of the `body` tag is the definition of the `hello`
template. This is what will be put in the body where we include the `{{>
hello}}` code snippet.

```
<template name="hello">
  <button>Click Me</button>
  <p>You've pressed the button {{counter}} times.</p>
</template>
```

The template `name` attribute determines how it can be included in the body, or
elsewhere in the application. It also determines how we will target the template
in our JS code.

If you look at the `.js` file in your project you will see code
for `Templates.hello.events` and `Templates.hello.helpers`. These are both ways
that we define behavior within the `hello` template.

## Put in our own markup

Copy in the following HTML to your template file. It include the bootstrap CSS
framework from a CDN (Content Delivery Network) and a very simple layout with
the application title in the top navbar.

```
<head>
  <title>Tweeteor</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" />
</head>

<body>
  <div class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <a href="#" class="navbar-brand">Tweeteor</a>
      </div>
    </div>
  </div>

  <div class="container tweets">
  </div>
</body>
```

Now let's flesh it out.

### Template helpers

Template helpers exist to allow you to provide data to your template so it can
be displayed. They also serve other purposes which will will cover on day 2.

We are going to start by creating a function that returns some data. For now
this is going to be a hardcoded array of tweets.

```
Template.body.helpers({
  tweets: function () {
    return [{
      text: 'This is a message! It is a very good one too.',
      createdAt: new Date()
    }, {
      text: 'Yet another message, this one is awesome.',
      createdAt: new Date()
    }, {
      text: 'This one is not so good, but it tried.',
      createdAt: new Date()
    }];
  }
});
```

Now when we call for this function in our template, this is what it will return.

## Looping in our template

Meteor uses a templating engine called [Spacebars](spacebars), which is based on
a JS templating engine called [Handlebars](handlebars).

There is a way to include logic and dynamic pieces of data into your templates.
To make this happen we use the special handlebars style syntax.

For example if we want to include a loop in our template, for instance, to
iterate over our list of tweets that we now have availble, let's put the
following code inside of our div with the class `tweets`.

```
{{#each tweets}}
  {{> tweet}}
{{/each}}
```

This tells our HTML to search for an available template helper called `tweets`
and to iterate over what it returns. Then `{{> tweet}}` will look for a template
named `tweet` that will have the data available in each returned tweet.

## Making our component template

The template we are going to create to handle the individual tweets can be
thought of as a "tweet component". It is a standalone component that will be
reused on the page for each tweet that exists. Because we used `{{> tweet}}` it
is expecting the name to match.

```
<template name="tweet">
  <div class="row tweet">
    <div class="col-xs-12">
      <p class="text lead">{{ text }}</p>
      <p class="time small">Posted: {{ createdAt }}</p>
      <hr>
    </div>
  </div>
</template>
```

Because each of our tweet objects returned from our template helper above has
both `text` and `createdAt` properties, those are made available in the
template.

If we save this and refresh the page, we should see our list of tweets on the
page!

## Cleaning up the dates

The `createdAt` date is accurate in our template, but it doesn't look all that
great. This is a good opportunity to show you an awesome date handling library
for JavaScript and to demonstrate the use of meteor packages.

The date library we will use is called [moment.js](momentjs). Date objects in
JavaScript are not the friendliest to work with. Moment provides a much better
interface.

To install moment, use:

```
$ meteor add momentjs:moment
```

Meteor has it's own package management system, you can browse packages at
[atmospherejs.com](https://atmospherejs.com/). Most times they will be
automatically included, such as in this case.

Now we have the `moment()` function available in our `.js` file. Let's change
the line in our template that displays the tweet time to:

```
<p class="time small">Posted: {{ time }}</p>
```

Instead of displaying `createdAt`, we are going to use a template helper called
`time`. This is a function we will need to define in our JS file, like so:


```
Template.tweet.helpers({
  time: function() {
    return moment(this.createdAt).fromNow();
  }
});
```

`Template.tweet.helpers` is a function that defines the helper functions
available on the `tweet` template. The reference to `this` refers to the tweet
object that is being passed to it.

Now when the `time` helper is called in the template, it will show the moment
formatted version of the `createdAt` time. Calling `.fromNow()` should show "a
few seconds ago".

## Today we covered:

* Installation
* Project creation
* Launching the server
* Templates and helpers
* Meteor packages






[meteor-windows-installer]: https://install.meteor.com/windows
[handlebars]: http://handlebarsjs.com/
[spacebars]: https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md
[momentjs]: http://momentjs.com/
