import os
import json
import boto3

SETTING_ID_FOR_CHART = "#chart"

TABLE_NAME = os.getenv("TABLE_NAME")
SESSION_INDEX_NAME = os.getenv("SESSION_INDEX_NAME")
SEARCH_INDEX_NAME = os.getenv("SEARCH_INDEX_NAME")
LEVEL_INDEX_NAME = os.getenv("LEVEL_INDEX_NAME")
STATUS_INDEX_NAME = os.getenv("STATUS_INDEX_NAME")
MEMO_INDEX_NAME = os.getenv("MEMO_INDEX_NAME")
MIRROR_INDEX_NAME = os.getenv("MIRROR_INDEX_NAME")
dynamodb = boto3.client("dynamodb")


# DynamoDBでの処理に失敗した際にraiseするエラー
class DataBaseError(Exception):
    pass


def SearchTuneAPI(user_id, request_body):
    difficulty = request_body["difficulty"]
    tune_search_word = request_body["tune_search_word"]
    
    user_response = list()
    chart_response = list()
    
    try:
        user_response = dynamodb.query(
            TableName = TABLE_NAME,
            IndexName = SEARCH_INDEX_NAME,
            KeyConditionExpression = "setting_info = :setting_info_val",
            FilterExpression = "contains( tune_name, :tune_name_val )",
            ExpressionAttributeValues = {
                ":setting_info_val": {"S": f"{user_id}#{difficulty}"},
                ":tune_name_val": {"S": tune_search_word},
            },
        )
        chart_response = dynamodb.query(
            TableName = TABLE_NAME,
            IndexName = SEARCH_INDEX_NAME,
            KeyConditionExpression = "setting_info = :setting_info_val",
            FilterExpression = "contains( tune_name, :tune_name_val )",
            ExpressionAttributeValues = {
                ":setting_info_val": {"S": f"{SETTING_ID_FOR_CHART}#{difficulty}"},
                ":tune_name_val": {"S": tune_search_word},
            },
        )
    except BaseException as be:
        # データベース側でエラーが発生した場合
        print(be)
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
        
    user_response_data = sorted(user_response["Items"], key=lambda x: x["tune_name"]["S"])
    chart_response_data = sorted(chart_response["Items"], key=lambda x: x["tune_name"]["S"])
    count = len(user_response_data)
    user_tune_id = None
    if count > 0:
        user_tune_id = (user_response_data[-count]["id"]["S"].split("#"))[0]
    for i in range(len(chart_response_data)):
        if count == 0:
            break
        chart_tune_id = (chart_response_data[i]["id"]["S"].split("#"))[0]
        if user_tune_id == chart_tune_id:
            chart_response_data[i] = user_response_data[-count]
            count -= 1
            user_tune_id = (user_response_data[-count]["id"]["S"].split("#"))[0]
        
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            #"Access-Control-Allow-Credentials": "true"
        },
        "body": json.dumps({
            "search_result": chart_response_data
        })
    }
    