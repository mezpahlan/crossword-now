# crossword-now

A Nodejs powered Slack bot in two parts built for Bluemix. A slash command and an incoming webhook to deliver crosswords for your Slack team.

Based on the work of David Amey.

## Configure Environment Variables

Since Bluemix is essentially Cloud Foundry under the covers this should work for Cloud Foundry too. I haven't tested on other platforms so results may vary.

## TODO

- [ ] Document PouchDB and Promises updates.
- [ ] Error scenarios
- [ ] Can't unhash in anyway (crossword, id, type). Handle this in the unhash and send error back
- [ ] Can unhash but crossword doesn't exist.
- [ ] Can unhash but clue doesn't exist.
- [ ] Will we get the same error response back from 2) and 3)?? If so, good.
