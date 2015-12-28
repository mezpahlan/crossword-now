# crossword-now

A Nodejs powered Slack bot in two parts built for Bluemix. A slash command and an incoming webhook to deliver crosswords for your Slack team.

Based on the work of David Amey.

## Configure Environment Variables

Since Bluemix is essentially Cloud Foundry under the covers this should work for Cloud Foundry too. I haven't tested on other platforms so results may vary.

1. Set the `WEBHOOK_IN_URL` in your User Defined environment variables for Bluemix / CF to the incoming webhook url that you create in your Slack team.
2. Also set it in the file `.config.env` so that you can test locally. Pay attention to the spacing either side of the equals sign - hint, there is none.
        WEBHOOK_IN_URL=<YOUR_URL>
3. Set the `MONGODB_URL` in to the same places to the URL for your Mongo instance.
4. You'll need to create a collection called `crosswords` and populate the collection with documents that, as a minimum, have an `entries` array, an `id`, and a `type`.
