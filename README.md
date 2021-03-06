member-info-bot
==================

Infers facts about the members of bands and TV shows!

Installation
------------

Clone this repo.

Then, create a `config/config.js` file in the project root that contains [Twitter API keys](https://gist.github.com/jimkang/34d16247b40097d8cace) and [Wordnik API key](http://developer.wordnik.com/). Example:

    module.exports = {
      twitter: {
        consumer_key: 'asdfkljqwerjasdfalpsdfjas',
        consumer_secret: 'asdfasdjfbkjqwhbefubvskjhfbgasdjfhgaksjdhfgaksdxvc',
        access_token: '9999999999-zxcvkljhpoiuqwerkjhmnb,mnzxcvasdklfhwer',
        access_token_secret: 'opoijkljsadfbzxcnvkmokwertlknfgmoskdfgossodrh'
      },
      wordnikAPIKey: 'mkomniojnnuibiybvuytvutrctrxezewarewetxyfcftvuhbg'
    };

Name sources:

- https://github.com/dominictarr/random-name/blob/master/first-names.json
- https://www.ssa.gov/oact/babynames/decades/century.html
- https://github.com/dariusk/corpora/master/data/humans/firstNames.json
- https://deron.meranda.us/data/nicknames.txt

Tests
---

Run tests with `make test`.

Usage
-----

    node post-tweet.js

License
-------

The MIT License (MIT)

Copyright (c) 2017 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
