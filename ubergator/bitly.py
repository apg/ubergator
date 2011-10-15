"""
demo usage

    # this is SERIOUSLY inefficient
    # call can support 15 at once, this demo uses a link

    python bitly.py "http://www.meetup.com/occupytogether/New-York-NY/406522/"

"""


import sys
import logging
import urllib2
import urllib

try:
    import json
except ImportError:
    import simplejson as json


BITLY_USER = "occupyinternet"
BITLY_HOST = "http://api.bitly.com"
BITLY_API_KEY = "R_c21414b88ed9c4cc76616f4fac9ec86d"


endpoints=dict(
    lookup="/v3/lookup",
    clicks="/v3/clicks",
)

def get_bitly(url, params):
    params.append(('format',"json") )
    try:
        url_resource=urllib2.urlopen( "%s?%s" % (url, urllib.urlencode(params) ) )
        response = url_resource.read()
        results = json.loads( response )
        return results
    except Exception,msg:
        logging.info("oops, error loading %s" % msg)
        return None
    return None

def auth_params():
    return [
        ('login',BITLY_USER),
        ('apiKey',BITLY_API_KEY),
    ]


def lookup( uri_list ):
    params=auth_params()
    # for uri_chunk in uri_list[:15]
    chunks = chunk_list( uri_list, 15)
    urls_looked_up=[]
    for chunk in chunks:
        q_list=[('url', uri) for uri in chunk]
        p = params[:] # copy list
        p.extend( q_list )
        results = get_bitly( "%s%s" % (BITLY_HOST, endpoints.get("lookup"), ), p )
        if results and results.get("status_code") == 200 and results.get("data"):
            urls_looked_up.extend( results.get("data").get("lookup") )
    return urls_looked_up

def clicks(hashes_list):
    params=auth_params()
    chunks = chunk_list( hashes_list, 15)
    hashes_lookedup=[]
    for chunk in chunks:
        q_list=[('hash', item.get("global_hash")) for item in chunk]
        p = params[:] # copy list
        p.extend( q_list )
        results = get_bitly( "%s%s" % (BITLY_HOST, endpoints.get("clicks"), ), p )
        if results and results.get("status_code") == 200 and results.get("data"):
            hashes_lookedup.extend( results.get("data").get("clicks") )

    return hashes_lookedup

def chunk_list( my_list, c_size=5 ):
    c_size=min(10,c_size)
    # break a list into smaller lists based on c_size (chunk size)
    return [my_list[i*c_size:i*c_size+c_size] for i in range(len(my_list)/c_size+int((len(my_list) % c_size) > 0))]

if __name__ == "__main__":
    # this is SERIOUSLY inefficient
    # call can support 15 at once, this demo uses a link
    print "looking up %s" % sys.argv[1]
    link_data = lookup( [sys.argv[1]] )
    click_data = clicks(link_data)
    print json.dumps(link_data)
    print json.dumps(click_data)

