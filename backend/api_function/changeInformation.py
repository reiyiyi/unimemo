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


def ChangeInformationAPI(user_id, request_body):
    chart_id = request_body["chart_id"]
    chart_status = request_body["chart_status"]
    memo = request_body["memo"]
    mirror = request_body["mirror"]
    
    try:
        response = dynamodb.update_item(
            TableName=TABLE_NAME,
            Key={
                "id": {
                    "S": chart_id
                }
            },
            UpdateExpression="SET status = :status_val, memo = :memo_val, memo_length = :memo_length_val, mirror = :mirror_val",
            ExpressionAttributeValues={
                ":status_val": {"S": chart_status},
                ":memo_val": {"S": memo},
                ":memo_length_val": {"N": str(len(memo))},
                ":mirror_val": {"S": mirror}
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
            'change_status': True
        })
    }
    