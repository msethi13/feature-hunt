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
from flask_mail import Mail, Message

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'seproject37@gmail.com'
app.config['MAIL_PASSWORD'] = 'ffyi cwen stql peyj'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

'''
Function: products
Description: Get/ Add/ Update/ Delete the products from the database
Inputs:
  - NA
Outputs:
  - NA
'''


@app.route('/products', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def products():
    if request.method == 'GET':
        data = product_records.find(
            {"$or" :
                [{
                    "name" :
                    {
                        "$regex" : request.args.get("query"),
                        '$options' : 'i'
                    }
                },
                {
                    "description" :
                    {
                        "$regex" : request.args.get("query"),
                        '$options' : 'i'
                    }
                },
                {
                    "tags" :
                    {
                        "$regex" : request.args.get("query"),
                        '$options' : 'i'
                    }
                }]
            })
        iterate = []
        for obj in data:
            if obj["image_url"] is None and obj["file_name"] is not None:
                url = ""
                obj["image_url"] = url
            iterate.append(obj)

        return dumps(iterate)

    data = request.get_json()

    if request.method == 'POST':
        if data is None or data == {}:
            return Response(response=json.dumps({"Error": "Please provide all necessary input"}),
                            status=400,
                            mimetype='application/json')
        return jsonify({'ok': True, 'message': 'Product added successfully'}), 200

    if request.method == 'DELETE':
        if data is None or data == {}:
            return Response(response=json.dumps({"Error": "Please provide all necessary input"}),
                            status=400,
                            mimetype='application/json')

        db_response = product_records.delete_one({'id': data[id]})
        if db_response.deleted_count == 1:
            response = {'ok': True, 'message': 'record deleted'}
        else:
            response = {'ok': True, 'message': 'no record found'}
        return jsonify(response), 200

    if request.method == 'PATCH':
        if data.get('query', {}) != {}:
            product_records.update_one(
                data['query'], {'$set': data.get('payload', {})})
            return jsonify({'ok': True, 'message': 'record updated'}), 200
        else:
            return jsonify({'ok': False, 'message': 'Bad request parameters!'}), 400


# def get_pre_signed(file_name):
#     response = s3.generate_presigned_url('get_object',
#                                          Params={'Bucket': "feature-hunt", 'Key': file_name},
#                                          ExpiresIn=500)
#     return response


'''
Function: get_feature
Description: Get the list of all features for given product name
Inputs:
  - productName: Name of the product
Outputs:
  - results: List of features that are available in that product
'''


@app.route('/<product_name>/getFeature', methods=['GET', 'POST'])
def get_feature(product_name):
    if request.method == 'GET':
        data = product_records.find({"name": product_name}, {"features": 1})
        return dumps(data)


'''
Function: features
Description: You can add/get features of a product
Inputs:
  - productName: Name of the product
Outputs:
  - results: Add features to that product or return feature list
'''


@app.route('/<product_name>/features', methods=['GET', 'POST'])
def features(product_name):
    result = ''
    if request.method == 'POST':
        data = request.form.get('features')
        data = json.loads(data)
        print(data, flush=True)
        if data is None or data == {}:
            return Response(response=json.dumps({"Error": "Please provide connection information"}),
                            status=400,
                            mimetype='application/json')
        result = product_records.find_one_and_update({"name": product_name}, {"$push": {"features": data}})
        
        product_data = product_records.find_one({"name":product_name})
        
        email = product_data['users'][0]
        msg = Message('New feature added', sender = 'seproject37@gmail.com', recipients = [email])
        mail.send(msg)
    elif request.method == 'GET':
        result = product_records.find({"name": product_name}, {"features": 1})
    
    return dumps(result)


@app.route('/<uid>/delete', methods=['DELETE'])
def delete(uid):
    strId = str(uid)
    result = product_records.delete_one({"uid": strId})
    print(result)
    return jsonify({'ok': True, 'message': 'record deleted'}), 200
