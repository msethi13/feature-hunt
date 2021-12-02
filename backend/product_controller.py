# pylint: disable=wrong-import-position,pointless-string-statement,undefined-variable,line-too-long

import datetime
from flask import jsonify
from flask import request
from app import app
from db_init import product_records
import datetime
from werkzeug.utils import secure_filename
import boto3
from botocore.client import Config

s3 = boto3.client(
    "s3",
    aws_access_key_id="AKIA6RGMAFYCJPCLFAUS",
    aws_secret_access_key="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",
    region_name='us-east-1',
    config=Config(signature_version='s3v4')
)

import time


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
        img = request.files['file']

        if img:
            file_name = secure_filename(img.filename)
            s3.upload_fileobj(
                img,
                "feature-hunt",
                file_name,
                ExtraArgs={
                    "ContentType": img.content_type  # Set appropriate content type as per the file
                }
            )

            response = s3.generate_presigned_url('get_object',
                                                 Params={'Bucket': "feature-hunt", 'Key': img.filename},
                                                 ExpiresIn=500)

            print(response)

        feature_dict = []

        product_input = {'uid': str(int(time.time())), 'name': product_name, 'description': product_description,
                            'image_url': image_url, 'users': [email], 'tags': tags, 'features': feature_dict, 'votes': 0}

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
