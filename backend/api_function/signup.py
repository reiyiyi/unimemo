import os
import json
import boto3
import hashlib

TABLE_NAME = os.getenv('TABLE_NAME')
SESSION_INDEX_NAME = os.getenv('SESSION_INDEX_NAME')
SEARCH_INDEX_NAME = os.getenv('SEARCH_INDEX_NAME')
LEVEL_INDEX_NAME = os.getenv('LEVEL_INDEX_NAME')
STATUS_INDEX_NAME = os.getenv('STATUS_INDEX_NAME')
MEMO_INDEX_NAME = os.getenv('MEMO_INDEX_NAME')
MIRROR_INDEX_NAME = os.getenv('MIRROR_INDEX_NAME')
dynamodb = boto3.client('dynamodb')


# DynamoDBでの処理に失敗した際にraiseするエラー
class DataBaseError(Exception):
    pass


# 文字列をSHA256ハッシュ関数によりハッシュ化する関数
def hashing(data):
    hashed_data = hashlib.sha256(data.encode()).hexdigest()
    
    return hashed_data

# ユーザIDが重複していないかどうか確認する関数
def user_id_check(user_id):
    try:
        response = dynamodb.query(
            TableName=TABLE_NAME,
            KeyConditionExpression = "id = :user_id_val",
            ExpressionAttributeValues={":user_id_val": {"S": f"{user_id}#user"}},
        )
    except BaseException as be:
        # エラーが発生した場合はエラーステータスを返す
        raise(DataBaseError(be))
    
    if response["Items"]:
        return False
    else:
        return True
    

def SignupAPI(request_body):
    user_id = request_body["user_id"]
    user_name = request_body["user_name"]
    password = request_body["password"]
    
    try:
        user_id_check_status = user_id_check(user_id)
    except DataBaseError as e:
        # データベース側でエラーが発生した場合
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": 'true'
            },
            'body': json.dumps({
                "message" : "Internal server error."
            })
        }
    
    if user_id_check_status:
        hashed_password = hashing(password)
        try:
            dynamodb.put_item(
                TableName=TABLE_NAME,
                Item={
                    "id": {"S": f"{user_id}#user"},
                    "user_name": {"S": user_name},
                    "password": {"S": hashed_password},
                    "session": {"S": ""},
                }
            )
        except BaseException as be:
            # データベース側でエラーが発生した場合
            return {
                'statusCode': 500,
                'headers': {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST",
                    #"Access-Control-Allow-Credentials": 'true'
                },
                'body': json.dumps({
                    "message" : "Internal server error."
                })
            }
            
        return {
            'statusCode': 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": 'true'
            },
            'body': json.dumps({
                'user_id_check_status': True
            })
        }
    else:
        return {
            'statusCode': 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": 'true'
            },
            'body': json.dumps({
                'user_id_check_status': False
            })
        }
    