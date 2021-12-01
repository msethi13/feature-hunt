# pylint: disable=wrong-import-position,pointless-string-statement,undefined-variable,line-too-long

from flask import jsonify
from flask import request
from app import app
from db_init import user_projects, product_records
from bson.json_util import dumps, loads
from bson.objectid import ObjectId
import datetime

#################################################################################
##       Function: add_product
##       Description: This post request is used to gather all the information from
##                    the project form and send it to the database to be stored
##       Inputs:
##           - NA
##       Outputs:
##           - Returns true or false if new project is able to be added
#################################################################################
@app.route("/addVote", methods=['Post'])
def add_votes():
        try:
            product_id = request.form.get("productId")
            emailId = request.form.get("emailId")
            
            #print(emailId, product_id)
            dat = user_projects.find({"email" : emailId})
            results = list(dat)
            if len(results)==0:
                input = {'email': emailId, 'votes': []}
                user_projects.insert_one(input)
                dat = user_projects.find({"email" : emailId})

            data = loads(dumps(results))
            #print(data[0]['email'])
            if product_id in data[0]['votes']:
                print("Voteup already exists")
                return jsonify(success=False)

            user_projects.update_one({'email': emailId}, {'$push': {'votes': product_id}})
            return jsonify(success=True)
        except:
            return jsonify(success=False)

@app.route("/removeVote", methods=['Post'])
def remove_votes():
        try:
            product_id = request.form.get("productId")
            emailId = request.form.get("emailId")
            
            #print(emailId, product_id)
            dat = user_projects.find({"email" : emailId})
            results = list(dat)
            if len(results)==0:
                input = {'email': emailId, 'votes': []}
                user_projects.insert_one(input)
                dat = user_projects.find({"email" : emailId})
                # No voteup done until now, no need to remove anything
                return jsonify(success=False)

            data = loads(dumps(results))
            #print(data[0]['email'])
            if product_id in data[0]['votes']:
                print("Voteup was done remove this element")
                user_projects.update_one({'email': emailId}, {'$pull': {'votes': product_id}})
                return jsonify(success=True)

            # Not votedup, nothing to remove
            return jsonify(success=False)
        except:
            return jsonify(success=False)


@app.route("/addTotalVote", methods=['Post'])
def add_total_votes():
        try:
            uid = request.form.get("uid")
            print(id)
            dat = product_records.find({"uid" : uid})
            results = list(dat)
            print(results)
            data = loads(dumps(results))
            print("prev_votes", data[0]['votes'])
            new_votes = data[0]['votes'] + 1
            product_records.update_one({'uid': uid}, {'$set': {'votes': new_votes}})
            return jsonify(success=True)
        except:
            return jsonify(success=False)

@app.route("/subTotalVote", methods=['Post'])
def sub_total_votes():
        try:
            uid = request.form.get("uid")
            # print(name)
            dat = product_records.find({"uid" : uid})
            results = list(dat)
            # print(results)
            data = loads(dumps(results))
            print("prev_votes", data[0]['votes'])
            new_votes = data[0]['votes'] - 1
            product_records.update_one({'uid': uid}, {'$set': {'votes': new_votes}})
            return jsonify(success=True)
        except:
            return jsonify(success=False)