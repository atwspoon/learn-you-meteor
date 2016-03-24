# Day 2 - DB CRUD

We've learned a bit about how meteor works, it's templating system, and how to
pass data to different template components. So far we've only hardcoded our data
into our JS file. In the real world we would use a database.

Just like everything else, meteor makes that super easy.

## Mongo built in

Meteor comes bundled with [Mongo DB](mongodb), and without us having to configure
anything will allow us to begin storing data in it that our application can
access. Let's do that now.

## Reading from the DB

To access items in mongo, in our JS code we first need to define the collection.
At the very top of our file, include this new line:

```
Tweets = new Mongo.Collection('tweets');
```

This will create a new mongo collection under the namespace of `tweets`. It
assigns this collection accessor to the `Tweets` global, which we can now use to
fetch tweets from the database.

Next we want to switch over our current `tweets` helper on the `body` template
to use the new mongo collection we've created instead of returning a hard-coded
array.

```
Template.body.helpers({
  tweets: function () {
    return Tweets.find({}, {
      sort: { createdAt: -1 }
    });
  }
});
```

Here we are using the `.find()` method on our mongo collection and passing it an
empty object. If we wanted to filter our query a bit to get specific tweets, we
would include more options in the object. In this case we just want every tweet
there is in the DB.

The second parameter we pass is how we want the tweets sorted when we get them
back. In this case, we want them order in reverse based on `createdAt`, so
newest ones show up first.

However, now we have no tweets displaying on our page. Let's look at how to add
things to the database.

## Adding to the DB

This is where we get to see the awesome magic built in to Meteor. Before we
learn how to add new tweets to the page using the interface we are going to
learn to add them to the database directly.

To open up a shell to our database, open a separate terminal window and `cd` to
the root of your project. From there type:

```
$ meteor mongo
```

**Note:** you have to have the meteor application running in another terminal
window for this command to work. 

We are now at the command prompt for our Mongo database. We can issue commands
to interact with the collections in our application directly. We're not going to
dive into using mongo directly much, but you can [learn more from their
documentation](mongodocs).

The fancy thing is that as soon as we enter something into the database, Meteor
will update the front end in realtime to reflect this change. So once we enter
the command, check the page to see how quickly the new tweet appears.

The command to insert a new tweet into our mongo DB is:

```
$ db.tweets.insert({ text: 'Here be a tweet!', createdAt: new Date() });
```

If you see `WriteResult({ "nInserted" : 1 })`, that means it worked! You should
now see the single tweet in our application in the browser.

### Adding new tweets from Meteor

This is great so far, but typically we will want the ability to create new
tweets to be handled by our interface and meteor code, not by going to the
database console directly. So let's see how we do that.

Don't worry, it's just as magical.

To create a new tweet in our meteor JS code, it would look something like this:

```
Tweets.insert({
  text: 'Here be a tweet, coming from another layer up.',
  createdAt: new Date()
});
```

If you take the above code and paste it directly into your browser's JS console
(in Chrome's developer tools, for instance) it would create a new tweet!

**Note**: This might seem like a red flag for security, but there is a way to
disable this ability. Meteor enables the `insecure` module by default for ease
of development. We'll get to that later.

So again, this is cool and everything, but in reality we probably want this to
happen in response to some interface interactions. Surely we don't expect our
users to open the JS console just to post a tweet.

So now we'll talk about..

### Template events

We've seen how to perform the action in question - create a new tweet - but we
need a way to know exactly *when* that action should occur. The way to do this
is with Template Events.

Before we look at defining events on the template, we need to add some markup.
We are going to need an input element on the page that the users will type their
new tweets into. Wrapped with Bootstrap markup, we get the following:

```
<div class="container">
  <div class="row">
    <form class="col-xs-12 new-tweet">
      <div class="form-group">
        <input type="text" name="text" class="form-control"
          placeholder="What cool thing do you have to say?">
      </div>
      <hr>
    </form>
  </div>
</div>
```

Put this right after the closing navbar div element. We should now have an input
at the top of our page to enter new tweets into.

We define events that we want to respond to within a particular template very
similar to the way we define helpers on that template:

```
Template.body.events({
  'submit .new-tweet': function(event) {
    event.preventDefault();

    Tweets.insert({
      text: event.target.text.value,
      createdAt: new Date()
    });

    event.target.text.value = '';
  }
});
```

The above bit of code is defining the events we will respond to on the `body`
template element. The `events` function takes an object where the keys represent
a combination of an event and a CSS selector that we will be listening for the
event on.

In this case, we are listening for the `submit` event on the `.new-tweet` form
element. Only forms can have a submit event. The value is a function that
describes what we want to happen when that event occurs.

First we cancel the default action of the event, which would effectively refresh
the page. Next we use the code we saw above to insert a new tweet into our Mongo
DB. For the `text` value, we use `event.target.text.value`. The event target is
the form, then `text` refers to the input with the name `text`, and `value` is
whatever is currently typed into it. Lastly, we reset the value of the input so
it is cleared out after saving.

Now we should be able to type something into the input, hit enter, and BAM! We
have a new tweet, saved to the database!

## Deleting a Tweet

Next we're going to learn how to remove a record from Mongo. We'll be adding
some markup to the page for a place to hook this behavior up to, but first let's
see what the command to remove a tweet looks like:

```
Tweet.remove(id);
```

That's it! We just need to know what the ID of the tweet that we want to remove
is. Thankfully, with template events, it's very easy to get that.

First, let's add the markup we need for a "delete" button on a tweet.

```
<button type="button" class="close">&times;</button>
```

This will go in the `tweet` template right under the opening line for our
`.col-xs-12` div and above the paragraph with the `.text` class.

Now what we need to do is specify the template event that we want to attach
deleting a tweet to. We have our CSS selector defined now: we will be targeting
the `.delete-tweet` element we added above. The event we will bind to is
`click`. So our addition to the JS file will be:

```
Template.tweet.events({
  'click .delete-tweet': function(event) {
    Tweets.remove(this._id);
  }
});
```

Notice the `this._id`. This is available to use because the template is used in
a collection where we are looping through a group of tweets. The same magic that
lets us access properties of the tweet in the HTML template using `{{ property
}}` let's us access properties in the template events using `this.attribute`.

One last thing -- let's make the interface a little better by changing the mouse
to a "pointer" when we hover the `x`. Do this by adding the following line to
our CSS file:

```
.delete-tweet { cursor: pointer; }
```

Now we can delete tweets!


## Today we covered:

* Accessing MongoDB from the command line
* Adding items to Mongo from Meteor
* Using template events
* Deleting items from Mongo


# Exercises

1. Prevent tweets from being created if the content is empty.
2. Add flash message capabilities.
  1. Display message for tweet deletion
  2. Display error for attempt to tweet without content
  3. Display success message when creating a tweet


[mongodb]: https://www.mongodb.com/
[mongodocs]: https://docs.mongodb.org/manual/
