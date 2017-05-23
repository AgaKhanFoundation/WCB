#!/usr/bin/env python

"""WCB CLI client.
"""

from __future__ import print_function

import argparse
import json
import os
import urllib2
import urlparse

ENTITIES = {
    '/': ['', ('',), (), ()],
    'achievement': ['achievement', ('', 'id'), ('name', 'distance'), ('id',)],
    'achievements': ['achievements', ('team', 'achievement'), ('team_id', 'achievement_id'),
                     ('id',)],
    'cause': ['causes', ('', 'id'), ('name',), ('id',)],
    'donor': ['donor', (), (), ()],
    'donors': ['donors', (), (), ()],
    'event': ['events', ('', 'id'), ('name', 'description', 'start_date', 'end_date', 'team_limit',
                                     'team_building_start', 'team_building_end'), ('id',)],
    'locality': ['localities', ('', 'id'), ('name',), ('id',)],
    'participant': ['participants', ('fbid',), ('fbid',), ('fbid',)],
    'record': ['records', ('id',), ('date', 'distance', 'participant_id', 'source_id'), ()],
    'source': ['sources', ('', 'id'), ('name',), ('id',)],
    'sponsor': ['sponsor', (), (), ()],
    'sponsors': ['sponsors', (), (), ()],
    'team': ['teams', ('', 'id'), ('name',), ('id',)],
}

CRUD = {
    'c': 'POST',
    'r': 'GET',
    'u': 'PATCH',
    'd': 'DELETE',
}


def construct_url(endpoint):
    """Build a URL from the scheme, server, and port parameters."""
    scheme = os.environ.get('SCHEME', 'https')
    domain = os.environ.get('SERVER', 'akf-causes.subshell.org')
    port = os.environ.get('PORT', '')
    if port:
        netloc = '{}:{}'.format(domain, port)
    else:
        netloc = domain
    url = urlparse.urlunparse((scheme, netloc, endpoint, '', '', ''))
    return url


def get(entity, endpoint, action, url, args):
    """Construct a GET request for the given entity and parameters."""
    if not ENTITIES[entity][1]:
        print('Method Not Allowed')
        return
    if entity == 'achievements':
        if not args:
            print('Query achievements with "team_id=<team_id>" \
                   or "achievement_id=<achievement_id>"')
            return
        if args[0].startswith('team'):
            url += '/team/{}'.format(args[0].split('=')[1])
        elif args[0].startswith('achievement'):
            url += '/achievement/{}'.format(args[0].split('=')[1])
        else:
            print('Query achievements with "team_id=<team_id>" \
                   or "achievement_id=<achievement_id>"')
            return
        return urllib2.Request(url)
    if args:
        url += '/{}'.format(args[0])
    return urllib2.Request(url)


def post(entity, endpoint, action, url, args):
    """Construct a POST request for the given entity and parameters."""
    if not ENTITIES[entity][2]:
        print('Method Not Allowed')
        return
    if len(args) != len(ENTITIES[entity][2]):
        print('Create {} requires the following parameters:\n{}'
              .format(entity, '\n'.join(ENTITIES[entity][2])))
        return
    data = {}
    for key, arg in zip(ENTITIES[entity][2], args):
        data[key] = arg
    req = urllib2.Request(url)
    req.add_data(json.dumps(data))
    return req


def patch(entity, endpoint, action, url, args):
    """Construct a PATCH request for the given entity and parameters."""
    if not ENTITIES[entity][3]:
        print('Method Not Allowed')
        return
    if not args:
        print('{} {} required'.format(entity, ENTITIES[entity][3][0]))
        return
    url += '/{}'.format(args[0])
    args = args[1:]
    if not args:
        print('fields to update must be provided in key=value format')
        return
    data = {}
    for arg in args:
        key, val = arg.split('=')
        data[key] = val
    req = urllib2.Request(url)
    req.add_data(json.dumps(data))
    return req


def destroy(entity, endpoint, action, url, args):
    """Construct a DELETE request for the given entity and parameters."""
    if not endpoint:
        print('Method Not Allowed')
        return
    if not args:
        if entity == 'achievements':
            print('{} id required'.format(entity))
        else:
            print('{} {} required'.format(entity, ENTITIES[entity][1][-1]))
        return
    url += '/{}'.format(args[0])
    return urllib2.Request(url)


def main():
    """Main function."""
    parser = argparse.ArgumentParser(description='WCB CLI client.')
    parser.add_argument('entity', choices=ENTITIES)

    subparsers = parser.add_subparsers(dest='subparser_name')
    create = subparsers.add_parser('c')
    create.set_defaults(func=post)

    read = subparsers.add_parser('r')
    read.set_defaults(func=get)

    update = subparsers.add_parser('u')
    update.set_defaults(func=patch)

    delete = subparsers.add_parser('d')
    delete.set_defaults(func=destroy)

    args = parser.parse_known_args()

    endpoint = ENTITIES[args[0].entity][0]
    action = CRUD[args[0].subparser_name]

    req = args[0].func(args[0].entity, endpoint, action, construct_url(endpoint), args[1])
    if not req:
        return

    req.add_header('Content-Type', 'application/json')
    req.get_method = lambda: action
    try:
        resp = urllib2.urlopen(req)
        print('Response Code: {}'.format(resp.getcode()))
        content = json.loads(resp.read())
        print(json.dumps(content, indent=2))
    except urllib2.HTTPError as err:
        print(err)
    except ValueError as err:
        print(err)


if __name__ == '__main__':
    main()
