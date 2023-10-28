import os
import json
import boto3

TABLE_NAME = os.getenv("TABLE_NAME")
SESSION_INDEX_NAME = os.getenv("SESSION_INDEX_NAME")
SEARCH_INDEX_NAME = os.getenv("SEARCH_INDEX_NAME")
LEVEL_INDEX_NAME = os.getenv("LEVEL_INDEX_NAME")
STATUS_INDEX_NAME = os.getenv("STATUS_INDEX_NAME")
MEMO_INDEX_NAME = os.getenv("MEMO_INDEX_NAME")
MIRROR_INDEX_NAME = os.getenv("MIRROR_INDEX_NAME")
dynamodb = boto3.client("dynamodb")

#Todo

# DynamoDBでの処理に失敗した際にraiseするエラー
class DataBaseError(Exception):
    pass


def GetChartAPI(user_id, request_body):
    chart_id = request_body["chart_id"]
    
    try:
        response = dynamodb.get_item(
            TableName=TABLE_NAME,
            Key={
                "id": {
                    "S": f"{chart_id}#{user_id}#setting"
                }
            }
        )
    except BaseException as be:
        # データベース側でエラーが発生した場合
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": "true"
            },
            "body": json.dumps({
                "message" : "Internal server error."
            })
        }
        
    # 譜面情報の設定情報がある場合
    if "Item" in response:
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": "true"
            },
            "body": json.dumps({
                "chart_data": response["Item"]
            })
        }
        
    # 譜面情報の設定情報が無い場合はDynamoDBに情報を登録
    try:
        chart_response = dynamodb.get_item(
            TableName=TABLE_NAME,
            Key={
                "id": {
                    "S": f"{chart_id}#chart"
                }
            }
        )
        level = chart_response["Item"]["level"]["S"]
        genre = chart_response["Item"]["genre"]["S"]
        tune_name = chart_response["Item"]["tune_name"]["S"]
        diff = chart_response["Item"]["difficulty"]["S"]
        response_data = {
                "id": {"S": f"{chart_id}#{user_id}#setting"},
                "setting_info": {"S": f"{user_id}#{diff}"},
                "chart_info": {"S": f"{genre}#{level}"},
                "level": {"S": level},
                "genre": {"S": genre},
                "tune_name": {"S": tune_name},
                "difficulty": {"S": diff},
                "status": {"S": "none"},
                "memo": {"S": ""},
                "memo_length": {"N": str(0)},
                "mirror": {"S": "off"}
            }
        dynamodb.put_item(
            TableName=TABLE_NAME,
            Item=response_data
        )
    except BaseException as be:
        # データベース側でエラーが発生した場合
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": "true"
            },
            "body": json.dumps({
                "message" : "Internal server error."
            })
        }
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            #"Access-Control-Allow-Credentials": "true"
        },
        "body": json.dumps({
            "chart_data": response_data
        })
    }
    