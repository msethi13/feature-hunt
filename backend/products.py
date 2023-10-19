"""
Copyright (C) 2023 Feature Hunt - All Rights Reserved
You may use, distribute and modify this code under the terms of the MIT license.
You should have received a copy of the XYZ license with
this file. If not, please write to: seproject37@gmail.com
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
        data = product_records.find({"name": product_name}, {"features": 1,"uid":1,"users":1})
        return dumps(data)

'''
Function: get_timeline
Description: You can get the suggested feature added to the product feature timeline
Inputs:
  - productNmae: name of the product
  

Outputs:
  - results: List of the features added to the feature timeline of the product
'''


@app.route('/<product_name>/getTimeline', methods=['GET'])
def get_timeline(product_name):
    try:
        if request.method == 'GET':
            data = product_records.find({"name": product_name}, {"timeline": 1})
            return dumps(data)
    except:
        return jsonify(success=False)

    
'''
Function: add_to_timeline
Description: You can add a suggested feature to the product feature timeline
Inputs:
  - productNmae: name of the product
  

Outputs:
  - results: Add a suggested feature to the feature timeline of a product
'''


@app.route('/<product_name>/getFeature/addToTimeline', methods=['POST'])
def add_to_timeline(product_name):
    if request.method == 'POST':
        feature_id = request.form.get('feature_id')
        dat = product_records.find({"name" : product_name})
        results = list(dat)
        data = loads(dumps(results))
        timeline = data[0]['timeline']
        features=data[0]['features']
        feature_list = []
        for x in features:
            if x['id']==int(feature_id):
                feature_list.append(x)
        uid = data[0]['uid']
        if feature_list[0] not in timeline:
            timeline.append(feature_list[0])
        product_records.update_one({'uid': uid}, {'$set': {'timeline': timeline}})        
        print(feature_list[0]['email'])
        msg = Message('Feature Added to Timeline', sender = 'seproject37@gmail.com', recipients = [feature_list[0]['email']])
        msg.body= "Congrats! Your suggested feature was added to the timeline for the product - " + product_name
        mail.send(msg)
        return dumps(timeline)
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
        print(data)
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

'''
Function: delete
Description: You can delete a product
Inputs:
  - uid: UID of the product
Outputs:
  - results: Remove product from the products list
'''

@app.route('/<uid>/delete', methods=['DELETE'])
def delete(uid):
    strId = str(uid)
    result = product_records.delete_one({"uid": strId})
    print(result)
    return jsonify({'ok': True, 'message': 'record deleted'}), 200


'''
Function: add_new_comment
Description: You can add a comment/get comments for a suggested feature
Inputs:
  - productIdd: UID of the product
  - feature_id: ID of the feature

Outputs:
  - results: Add a new comment to the feature/Displays all the comments for the features
'''


@app.route('/<productId>/<feature_id>/comment', methods=['GET','POST'])
def add_new_comment(productId, feature_id):
    if request.method=='POST':
        comment = request.form.get('comments')
        comment = json.loads(comment)
        dat = product_records.find({"uid" : productId})
        results = list(dat)
        data = loads(dumps(results))
        
        features = data[0]['features']
        comments=features[int(feature_id)-1]["comments"]
        comments.append(comment)
        features[int(feature_id)-1]["comments"]=comments
        print(features)
        result = product_records.find_one_and_update({"uid": productId}, {"$set": {"features": features}})
        
        return dumps(result)
        
    elif request.method == 'GET':
        dat = product_records.find({"uid" : productId})
        results = list(dat)
        data = loads(dumps(results))
        features = data[0]['features']
        comments=features[int(feature_id)-1]["comments"]
        return dumps(comments)
    








