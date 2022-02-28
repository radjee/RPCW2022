from ctypes import cast
import json
import movie_generator as mg
import actor_generator as ag
import actores_generator as ags
import index_generator as ig

# Function that gets the movie title
def getTitle(movie):
    return (movie['title']).lower()

# Function that gets the actors name according to utf-8
def getActor(actor):
    return str(actor, 'UTF-8')

# Opening JSON File
f = open('cinemaATP.json')

# dictionary with data and respective sorting
data = json.load(f)
data.sort(key=getTitle)

actors = {}

# Gerar movies html
for index, movie in enumerate(data):
    title = movie.get("title")
    cast_m = movie.get("cast")
    genres = movie.get("genres")

    for actor in cast_m:
        if actor in actors:
            actors[actor][0].add((title, index+1))

            for genre in genres:
                actors[actor][1].add(genre)
        else:
            actors[actor] = (set([(title, index+1)]), set(genres))

# Sort Actors
list_actors = list(actors.items())
list_actors.sort()

actor_tuples = []
names = list(map(lambda x: x[0], list_actors))

# Generate actor htmls
for a_index, actor in enumerate(list_actors):
    actor_name = actor[0]
    movies = actor[1][0]
    genres = actor[1][1]

    actor_tuples.append((a_index+1, actor_name))
    ag.a_generator(a_index+1, actor_name, movies, genres)

movie_tuples = []

for m_index, movie in enumerate(data):
    title = movie.get("title")
    year = movie.get("year")
    cast_m = movie.get("cast")
    genres = movie.get("genres")

    # Generate movie htmls
    cast_tuple = []
    
    for p in cast_m:
        if p in names:
            cast_tuple.append((p, names.index(p)))
    
    movie_tuples.append((m_index+1, title))

    mg.m_generator(m_index+1, title, year, cast_tuple, genres)

# Gerar index.html
ig.index_generator(movie_tuples)

# Gerar atores.html
ags.atores_generator(actor_tuples)

# Closing File
f.close()