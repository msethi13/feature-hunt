"""
Copyright (C) 2021 Feature Hunt - All Rights Reserved
You may use, distribute and modify this code under the terms of the MIT license.
You should have received a copy of the XYZ license with
this file. If not, please write to: featurehuntteam@gmail.com
"""

# pylint: disable=wrong-import-position,poiackend-lontless-string-statement,undefined-variable,line-too-long

import os
from sys import stderr
from flask import request, jsonify, Response
from flask import json
from app import app

from bson.json_util import dumps,loads
from bson.objectid import ObjectId

# from product_controller import s3
from db_init import product_records

'''
Function: products
Description: Get/ Add/ Update/ Delete the products from the database
Inputs:
  - NA
Outputs:
  - NA
'''



'''
Function: get_feature
Description: Get the list of all features for given product name
Inputs:
  - productName: Name of the product
Outputs:
  - results: List of features that are available in that product
'''


@app.route('/<product_id>/<feature_id>/forum', methods=['GET'])
def get_feature(product_name):
    if request.method == 'GET':
        print('redirected')
