# pylint: skip-file
# pylint: disable=pointless-string-statement,undefined-variable,line-too-long

from flask import Flask
from os import environ
from flask_cors import CORS

app = Flask(__name__)
from auth_controller import *
from products import *
from product_controller import *
from user_projects_controller import *
from db_init import db
from ping import *

app.secret_key = "testing"
CORS(app)

import pymongo

client = pymongo.MongoClient("mongodb+srv://akshat1701:SEDemo1234@cluster0.udjlpg8.mongodb.net/?retryWrites=true&w=majority")
db = client.get_database('feature-hunt')
records = db.users
product_records = db.products
user_projects = db.user_projects

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
    # app.debug = True
    # waitress.serve(app, port=environ.get("PORT", 5000))
