#!/usr/bin/env python

from functools import partial

import time
import sys
import feedparser

try:
    import json
except ImportError:
    import simplejson as json


def date2ts(date):
    pass


def get_feed(url):
    return feedparser.parse(url)


def munge_item(feed, item):
    return {
        'timestamp': time.time(), # wrong!
        'lat': 0,
        'lon': 0,
        'type': 'rss',
        'groupName': feed.get('title'),
        'object': {
            'title': feed.get('title', ''),
            'description': feed.get('description', ''),
            'link': feed.get('title', ''),
            'item': {
                'guid': item.get('guid', ''),
                'title': item.get('title', ''),
                'link': item.get('link', ''),
                'description': item.get('description', ''),
                'category': item.get('category', ''),
                'author': item.get('author', ''),
                'summary': item.get('summary', ''),
                'pubDate': item.get('pubDate', ''),
                'source': item.get('source', '')
                }
            }
        }


def get_items(url):
    feed = get_feed(url)
    f = partial(munge_item, feed.feed)
    return map(f, feed.entries)


if __name__ == '__main__':
    for n in get_items(sys.argv[1]):
        print json.dumps(n)
