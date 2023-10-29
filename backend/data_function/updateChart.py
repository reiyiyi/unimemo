import os
import requests
import json
import boto3

ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
SETTING_ID_FOR_CHART = "#chart"
DIFFICULTY_LIST = [
    "BASIC",
    "ADVANCED",
    "EXPERT",
    "MASTER"
]

TABLE_NAME = os.getenv("TABLE_NAME")
SEARCH_INDEX_NAME = os.getenv("SEARCH_INDEX_NAME")
dynamodb = boto3.client("dynamodb")

# APIでの処理に失敗した際にraiseするエラー
class APIError(Exception):
    pass

# DynamoDBでの処理に失敗した際にraiseするエラー
class DataBaseError(Exception):
    pass


def get_chart():
    url = f"https://api.chunirec.net/2.0/music/showall.json?region=jp2&token={ACCESS_TOKEN}"
    try:
        response = requests.get(url)
    except BaseException as be:
        # エラーが発生した場合はエラーステータスを返す
        raise(APIError(be))
    
    return response.json()


def lambda_handler(event, context):
    try:
        # CHUNITHMに収録されている楽曲の譜面情報データを取得
        chart_data_list = get_chart()
    except APIError as e:
        # API通信でエラーが発生した場合
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
    
    try:
        master_data_response = dynamodb.query(
            TableName = TABLE_NAME,
            IndexName = SEARCH_INDEX_NAME,
            KeyConditionExpression = "setting_info = :setting_info_val",
            ExpressionAttributeValues = {
                ":setting_info_val": {"S": f"{SETTING_ID_FOR_CHART}#MASTER"}
            },
        )
        ultima_data_response = dynamodb.query(
            TableName = TABLE_NAME,
            IndexName = SEARCH_INDEX_NAME,
            KeyConditionExpression = "setting_info = :setting_info_val",
            ExpressionAttributeValues = {
                ":setting_info_val": {"S": f"{SETTING_ID_FOR_CHART}#ULTIMA"}
            },
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
        
    # データベースに保存されている楽曲を取得
    tune_data_set = set()
    for master_data in master_data_response["Items"]:
        tune_data_set.add(master_data["id"]["S"])
        
    # データベースに保存されているULTIMA譜面情報を取得
    ultima_data_set = set()
    for ultima_data in ultima_data_response["Items"]:
        tune_data_set.add(ultima_data["id"]["S"])
       
    # データベースに保存されていない楽曲を検出し、その譜面情報データを保存 
    for chart_data in chart_data_list:
        if chart_data["meta"]["genre"] == "WORLD'S END":
            continue 
        tune_id = chart_data["meta"]["id"]
        if f"{tune_id}#MASTER#chart" not in tune_data_set:
            try:
                for difficulty in DIFFICULTY_LIST:
                    tune_name = chart_data["meta"]["title"]
                    genre = chart_data["meta"]["genre"]
                    level = chart_data["data"][difficulty[:3]]["level"]
                    if int(level * 10) % 10 == 0:
                        level = str(int(level))
                    else:
                        level = f"{str(int(level))}+"    
                    dynamodb.put_item(
                        TableName=TABLE_NAME,
                        Item={
                            "id": {"S": f"{tune_id}#{difficulty}#chart"},
                            "setting_info": {"S": f"{SETTING_ID_FOR_CHART}#{difficulty}"},
                            "chart_info": {"S": f"{genre}#{level}"},
                            "level": {"S": level},
                            "genre": {"S": genre},
                            "tune_name": {"S": tune_name},
                            "difficulty": {"S": difficulty},
                            "status": {"S": "none"},
                            "memo": {"S": ""},
                            "memo_length": {"N": str(0)},
                            "mirror": {"S": "off"},
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
                
    # データベースに保存されていないULTIMA譜面情報を検出し、その譜面情報データを保存 
    for chart_data in chart_data_list:
        if "ULT" not in chart_data["data"]:
            continue
        tune_id = chart_data["meta"]["id"]
        if f"{tune_id}#ULTIMA#chart" not in ultima_data_set:
            try:
                tune_name = chart_data["meta"]["title"]
                genre = chart_data["meta"]["genre"]
                level = chart_data["data"]["ULT"]["level"]
                if int(level * 10) % 10 == 0:
                    level = str(int(level))
                else:
                    level = str(int(level)) + "+"    
                dynamodb.put_item(
                    TableName=TABLE_NAME,
                    Item={
                        "id": {"S": f"{tune_id}#ULTIMA#chart"},
                        "setting_info": {"S": f"{SETTING_ID_FOR_CHART}#ULTIMA"},
                        "chart_info": {"S": f"{genre}#{level}"},
                        "level": {"S": level},
                        "genre": {"S": genre},
                        "tune_name": {"S": tune_name},
                        "difficulty": {"S": "ULTIMA"},
                        "status": {"S": "none"},
                        "memo": {"S": ""},
                        "memo_length": {"N": str(0)},
                        "mirror": {"S": "off"},
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
        
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "update_status": True
        })
    }