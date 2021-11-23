# pylint: skip-file
# pylint: disable=pointless-string-statement,undefined-variable,line-too-long

from flask import Flask
from os import environ
from flask_cors import CORS
import waitress

app = Flask(__name__)
from auth_controller import *
from products import *
from product_controller import *
from db_init import db
from ping import *

app.secret_key = "testing"
CORS(app)

if __name__ == "__main__":
    app.run(debug=True, port=environ.get("PORT", 5000))
    # app.debug = True
    # waitress.serve(app, port=environ.get("PORT", 5000))
