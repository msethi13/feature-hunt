import os
import certifi
import pymongo

client = pymongo.MongoClient("mongodb+srv://akshat1701:SEDemo1234@cluster0.udjlpg8.mongodb.net/?retryWrites=true&w=majority",tlsCAFile=certifi.where())
db = client.get_database('feature-hunt')
records = db.users
product_records = db.products
user_projects = db.user_projects
