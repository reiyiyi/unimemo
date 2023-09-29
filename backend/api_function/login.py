import os
import json
import boto3
import string
import secrets
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


# セッション文字列を生成する関数
def create_session(user_id):
    chars = string.ascii_letters + string.digits
    while True:
        length = secrets.choice(range(16, 20))
        session = "".join([secrets.choice(chars) for _ in range(length)])
        try:
            response = dynamodb.query(
                TableName=TABLE_NAME,
                IndexName = SESSION_INDEX_NAME,
                KeyConditionExpression = "#se = :session_val",
                ExpressionAttributeNames= {
                    '#se' : 'session',
                },
                ExpressionAttributeValues={":session_val": {"S": session}},
            )
        except BaseException as be:
            # エラーが発生した場合はエラーステータスを返す
            raise(DataBaseError(be))
        
        # セッション値が被った場合は再生成
        if response["Items"]:
            continue
        
        # DynamoDBにセッション値を保存
        try:
            response = dynamodb.update_item(
                TableName=TABLE_NAME,
                Key={
                    "id": {
                        "S": user_id
                    }
                },
                UpdateExpression="SET #se = :session_val",
                ExpressionAttributeNames= {
                    '#se' : 'session',
                },
                ExpressionAttributeValues={":session_val": {"S": session}},
            )
        except BaseException as be:
            # エラーが発生した場合はエラーステータスを返す
            raise(DataBaseError(be))
        
        return session

# 文字列をSHA256ハッシュ関数によりハッシュ化する関数
def hashing(data):
    hashed_data = hashlib.sha256(data.encode()).hexdigest()
    
    return hashed_data

# ログイン出来るかどうか確認する関数
def login_check(user_id, password):
    try:
        response = dynamodb.get_item(
            TableName=TABLE_NAME,
            Key={
                "id": {
                    "S": user_id
                }
            }
        )
    except BaseException as be:
        # エラーが発生した場合はエラーステータスを返す
        raise(DataBaseError(be))
        
    # ユーザIDが間違っている場合はFalseを返す
    if "Item" not in response:
        return False
    # パスワードが合っているかを確認する
    hashed_password = hashing(password)
    if response["Item"]["password"]["S"] == hashed_password:
        return True
    else:
        return False
    
    
def LoginAPI(request_body):
    user_id = request_body["user_id"] + "#user"
    password = request_body["password"]
    
    try:
        # ログインに成功したかを判定する
        login_check_status = login_check(user_id, password)
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
    
    if login_check_status:
        try:
            # セッション情報の生成を行なう
            session = create_session(user_id)
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
            
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": 'true'
            },
            'body': json.dumps({
                'login_check_status': True,
                'session': session,
            })
        }
    else:
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": 'true'
            },
            'body': json.dumps({
                'login_check_status': False,
                'session': "",
            })
        }