# pylint: disable=wrong-import-position,pointless-string-statement,undefined-variable,line-too-long

from flask import jsonify
from flask import request
from app import app
from db_init import user_projects, product_records
from bson.json_util import dumps, loads


#################################################################################
##       Function: add_votes
##       Description: This post request is used to add user voted product_id in
##                      user_projects db
##       Inputs:
##           - NA
##       Outputs:
##           - Returns true or false if new vote is able to be added
#################################################################################
@app.route("/addVote", methods=['Post'])
def add_votes():
    """To add vote done by user in user_project db"""
    try:
        product_id = request.form.get("productId")
        email_id = request.form.get("emailId")
        #print(emailId, product_id)
        dat = user_projects.find({"email" : email_id})
        results = list(dat)
        if len(results)==0:
            intial_entry = {'email': email_id, 'votes': []}
            user_projects.insert_one(intial_entry)
            dat = user_projects.find({"email" : email_id})

        data = loads(dumps(results))
        #print(data[0]['email'])
        if product_id in data[0]['votes']:
            print("Voteup already exists")
            return jsonify(success=False)

        user_projects.update_one({'email': email_id}, {'$push': {'votes': product_id}})
        return jsonify(success=True)
    except:
        return jsonify(success=False)

#################################################################################
##       Function: remove_votes
##       Description: This post request is used to remove user voted product_id in
##                      user_projects db
##       Inputs:
##           - NA
##       Outputs:
##           - Returns true or false if new vote is able to be removed
#################################################################################
@app.route("/removeVote", methods=['Post'])
def remove_votes():
    """To remove vote done by user in user_project db"""
    try:
        product_id = request.form.get("productId")
        email_id = request.form.get("emailId")
        #print(emailId, product_id)
        dat = user_projects.find({"email" : email_id})
        results = list(dat)
        if len(results)==0:
            intial_entry = {'email': email_id, 'votes': []}
            user_projects.insert_one(intial_entry)
            dat = user_projects.find({"email" : email_id})
            # No voteup done until now, no need to remove anything
            return jsonify(success=False)

        data = loads(dumps(results))
        #print(data[0]['email'])
        if product_id in data[0]['votes']:
            print("Voteup was done remove this element")
            user_projects.update_one({'email': email_id}, {'$pull': {'votes': product_id}})
            return jsonify(success=True)

        # Not votedup, nothing to remove
        return jsonify(success=False)
    except:
        return jsonify(success=False)


#################################################################################
##       Function: add_total_votes
##       Description: This post request is used to add votes to product db.
##                     The prodcut db holds the actual total number of vote.
##       Inputs:
##           - NA
##       Outputs:
##           - Returns true or false if new vote is able to be removed
#################################################################################
@app.route("/addTotalVote", methods=['Post'])
def add_total_votes():
    """To accumulate votes on any product"""
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

#################################################################################
##       Function: sub_total_votes
##       Description: This post request is used to subtract votes to product db.
##                     The prodcut db holds the actual total number of vote.
##       Inputs:
##           - NA
##       Outputs:
##           - Returns true or false if new vote is able to be removed
#################################################################################
@app.route("/subTotalVote", methods=['Post'])
def sub_total_votes():
    """To reduce accumulated votes on any product"""
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
