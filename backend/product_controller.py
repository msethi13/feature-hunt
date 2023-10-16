import datetime
import os
from flask import jsonify
from flask import request
from app import app
from db_init import user_projects, product_records
import datetime
from werkzeug.utils import secure_filename
# import boto3
# from botocore.client import Config
import time
from bson.json_util import dumps, loads

# s3 = boto3.client(
#     "s3",
#     aws_access_key_id=os.environ.get("ACCESS_KEY"),
#     aws_secret_access_key=os.environ.get("SECRET_KEY"),
#     region_name='us-east-1',
#     config=Config(signature_version='s3v4')
# )


@app.route("/addProduct", methods=['Post'])
#################################################################################
#       Function: add_product
#       Description: This post request is used to gather all the information from
#                    the project form and send it to the database to be stored
#       Inputs:
#           - NA
#       Outputs:
#           - Returns true or false if new project is able to be added
#################################################################################
def add_product():
    """To add new product in product_records."""
    try:
        product_name = request.form.get("productName")
        product_description = request.form.get("productDescription")
        image_url = request.form.get("imageUrl")
        email = request.form.get("email")
        tags = request.form.get("tags").split(' ')
        views = []
        file_name = ''
        timeline = []
        if request.files:
            img = request.files['file']
            file_name = secure_filename(img.filename)
            # s3.upload_fileobj(
            #     img,
            #     "feature-hunt",
            #     file_name,
            #     ExtraArgs={
            #         "ContentType": img.content_type  # Set appropriate content type as per the file
            #     }
            # )

        feature_dict = []

        product_input = {'uid': str(int(time.time())), 'name': product_name, 'description': product_description,
                         'image_url': image_url, 'users': [email], 'tags': tags, 'features': feature_dict, 'votes': 0,
                         'file_name': file_name,'views':views, 'timeline':timeline}

        product_records.insert_one(product_input)

        return jsonify(success=True)
    except:
        return jsonify(success=False)

# @app.route("/<productName>/addFeature", method=['Post'])
# def addFeature(productName):
#     if request.method == 'POST':
#         data = request.json
#         data['_id'] = ObjectId()
#         print(data)
#         if data is None or data == {}:
#             return Response(response=json.dumps({"Error":
#                             "Please provide connection information"}),
#                             status=400,
#                             mimetype='application/json')
#         result = product_records.find_one_and_update(
#             {"project_name": productName}, {"$push": {"features": data}}
#         )
#
#         return jsonify(success=True)
#
#     elif request.method == 'GET':
#         result = mongo.db.products.find({"name": productname}, {"features": 1})
#     return dumps(result)

#################################################################################
##       Function: final_feature_votes
##       Description: This post request is used to add votes to db.
##                     The feature array inside product db holds the actual total number of vote.
##       Inputs:
##           - NA
##       Outputs:
##           - returns true/false depending on whether the add/subtraction of vote was successful or not
#################################################################################
@app.route("/finalFeatureVote", methods=['Post'])
def final_feature_votes():
    """To accumulate votes on any feature."""
    try:
        uid = request.form.get("productId")
        feature_id = int(request.form.get("featureId"))
        is_add = int(request.form.get("isAdd"))
        dat = product_records.find({"uid" : uid})
        results = list(dat)
        data = loads(dumps(results))
        if len(data) == 0:
            return jsonify(success=False, message="Product not found")

        data = data[0]  # Extract the first document (assuming a unique product per UID)

        feature_to_update = None
        for feature in data["features"]:
            if int(feature["id"]) == feature_id:
                feature_to_update = feature
                break

        if feature_to_update is None:
            return jsonify(success=False, message="Feature not found")

        # Update the feature's vote count based on the "is_add" flag
        if is_add == 1:
            feature_to_update["votes"] += 1
        if is_add == 0:
            feature_to_update["votes"] -= 1
        else:
            feature_to_update["votes"] = feature_to_update["votes"]

        # Define the filter to identify the product by UID and the feature within the array by its ID
        filter = {"uid": uid, "features.id": feature_id}

        # Define the update operation using the positional operator ($) to update the specific feature
        update = {
            "$set": {"features.$.votes": feature_to_update["votes"]}  # Replace 0 with the updated vote count
        }

        result = product_records.update_one(filter, update)
        return jsonify(success=True)
    except:
        return jsonify(success=False)
    

@app.route("/upvoteFeature", methods=['Post'])
#################################################################################
#       Function: upvote_feature
#       Description: This post request is used to upvote a feature. (A user can only upvote once from the current state)
#       Inputs:
#           - NA
#       Outputs:
#           - True if the upvote was successful else false
#################################################################################
def upvote_feature():
    """To add vote in db"""
    try:
        product_id = request.form.get("productId")
        feature_id = request.form.get("featureId")
        email_id = request.form.get("emailId")
        dat = user_projects.find({"email" : email_id})
        results = list(dat)
        if len(results)==0:
            intial_entry = {'email': email_id, 'votes': []}
            user_projects.insert_one(intial_entry)
            dat = user_projects.find({"email" : email_id})
            # No upvote done until now, no need to remove anything
            return jsonify(success=False)

        data = loads(dumps(results))
        print(data[0])
        if (product_id + "up" + feature_id) in data[0]['votes'] and (product_id + "down" + feature_id) not in data[0]['votes']: #not allowed to upvote
            return jsonify(success=False)
        
        if (product_id + "down" + feature_id) in data[0]['votes'] and (product_id + "up" + feature_id) in data[0]['votes']: #allowed to upvote once more
            user_projects.update_one({'email': email_id}, {'$pull': {'votes': product_id + "down" + feature_id}})
            return jsonify(success=True)

        user_projects.update_one({'email': email_id}, {'$push': {'votes': product_id + "up" + feature_id}}) #first upvote - success
        return jsonify(success=True)
    except:
        return jsonify(success=False)
    

    #################################################################################
##       Function: remove_votes
##       Description: This post request is used to downvote a feature. (A user can only downvote once from the current state)

##       Inputs:
##           - NA
##       Outputs:
##           - True if the downvote was successful else false
#################################################################################
@app.route("/downvoteFeature", methods=['Post'])
def downvote_features():
    """To remove vote done by user in user_project db."""
    try:
        print("here")
        product_id = request.form.get("productId")
        feature_id = request.form.get("featureId")
        email_id = request.form.get("emailId")
        dat = user_projects.find({"email" : email_id})
        results = list(dat)
        if len(results)==0:
            intial_entry = {'email': email_id, 'votes': []}
            user_projects.insert_one(intial_entry)
            dat = user_projects.find({"email" : email_id})
            # No downvote done until now, no need to remove anything
            return jsonify(success=False)

        data = loads(dumps(results))
        print(data[0])
        if (product_id + "down" + feature_id) in data[0]['votes'] and (product_id + "up" + feature_id) not in data[0]['votes']: #not allowed to downvote
            return jsonify(success=False)
        
        if (product_id + "down" + feature_id) in data[0]['votes'] and (product_id + "up" + feature_id) in data[0]['votes']: #allowed to downvote once more
            user_projects.update_one({'email': email_id}, {'$pull': {'votes': product_id + "up" + feature_id}})
            return jsonify(success=True)

        user_projects.update_one({'email': email_id}, {'$push': {'votes': product_id + "down" + feature_id}}) #first downvote - success
        return jsonify(success=True)
        
    except:
        return jsonify(success=False)