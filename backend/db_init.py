import os

import pymongo

client = pymongo.MongoClient(os.environ.get("DB_PATH"))
db = client.get_database('feature-hunt')
records = db.users
product_records = db.products
user_projects = db.user_projects
