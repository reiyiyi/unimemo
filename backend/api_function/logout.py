import os
import json
import boto3

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


def LogoutAPI(user_id, request_body):
    try:
        response = dynamodb.update_item(
            TableName=TABLE_NAME,
            Key={
                "id": {
                    "S": f"{user_id}#user"
                }
            },
            UpdateExpression="SET #se = :session_val",
            ExpressionAttributeNames= {
                    '#se' : 'session',
            },
            ExpressionAttributeValues={
                ":session_val": {"S": ""}
            },
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
        'headers': {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            #"Access-Control-Allow-Credentials": 'true'
        },
        'body': json.dumps({
            'logout_check_status': True
        })
    }
    