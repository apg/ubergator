



occupy internet
-------

Get data, put in a flat text file, add <code>.json<code>

format like below, please

    {
     'timestamp': <timestamp the the event occured if available>,
     'lat': <if available>,
     'lon': <if available somehow>,
     'associatedGroup': <if discernable>,
     'type': <essentially source, twitter, rss, atom, facebook, meetup>,
     'object': { 'jsonified object' that this represents }
    }


running html/static
-------

b/c every good website needs at least a page on the internet

    cd static
    python -m SimpleHTTPServer 8005

In a web brower, <http://localhost:8005>

simulated save rss feed, nothing fancy.

<http://localhost:8005/add_feeds.html>


    http://localhost:8005/data/save/endpoint?url=http%3A%2F%2Ffoo.com%2Fafadfd

bitly.py
------

demo / sample example

    # this is SERIOUSLY inefficient
    # call can support 15 at once, this demo uses a link

    python bitly.py "http://www.meetup.com/occupytogether/New-York-NY/406522/"

