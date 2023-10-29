import os
import json
import boto3
from signup import SignupAPI
from login import LoginAPI
from searchChart import SearchChartAPI
from searchTune import SearchTuneAPI
from searchMemo import SearchMemoAPI
from searchStatus import SearchStatusAPI
from searchMirror import SearchMirrorAPI
from getChart import GetChartAPI
from changeInformation import ChangeInformationAPI
from changeName import ChangeNameAPI
from logout import LogoutAPI

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


# セッション情報からユーザIDの取得をする関数
def get_user_id(session):
    USER_TAG = "#user"
    # セッション情報が無い場合は空文字列を返す
    if not session:
        return ""
    
    try:
        response = dynamodb.query(
            TableName=TABLE_NAME,
            IndexName = SESSION_INDEX_NAME,
            KeyConditionExpression = "#se = :session_val",
            ExpressionAttributeNames= {
                "#se" : "session",
            },
            ExpressionAttributeValues={":session_val": {"S": session}},
        )
    except BaseException as be:
        # エラーが発生した場合はエラーステータスを返す
        raise(DataBaseError(be))
    
    # 与えられたセッション値と紐づけられているユーザIDが無い場合は空文字列を返す
    if not response["Items"]:
        return ""
    
    # ユーザIDを返す
    return response["Items"][0]["id"]["S"][:-len(USER_TAG)]


def handler(event, context):
    request_body = eval(event["body"])
    request_api_name = request_body["API"]
    
    print(f"Requested API name: {request_api_name}")
    
    # 新規登録処理を行なうAPI
    if request_api_name == "SignupAPI":
        return SignupAPI(request_body)
    
    # ログイン処理を行なうAPI
    if request_api_name == "LoginAPI":
        return LoginAPI(request_body)
    
    #--------以下のAPIはログイン状態であることが必要--------
    session = request_body["session"]
    try:
        user_id = get_user_id(session)
    except DataBaseError as e:
        # データベース側でエラーが発生した場合
        print(e)
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
    
    # ユーザIDを取得出来なかった場合
    if not user_id:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                #"Access-Control-Allow-Credentials": "true"
            },
            "body": json.dumps({
                "message" : "Please login."
            })
        }
        
    # ユーザIDの取得を行なうAPI
    if request_api_name == "GetUserIdAPI":
        return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            #"Access-Control-Allow-Credentials": "true"
        },
        "body": json.dumps({
            "user_id": user_id
        })
    }
        
    # 譜面情報をもとに譜面の検索処理を行なうAPI
    if request_api_name == "SearchChartAPI":
        return SearchChartAPI(user_id, request_body)
    
    # 曲名をもとに譜面の検索処理を行なうAPI
    if request_api_name == "SearchTuneAPI":
        return SearchTuneAPI(user_id, request_body)
    
    # メモが設定された譜面の検索処理を行なうAPI
    if request_api_name == "SearchMemoAPI":
        return SearchMemoAPI(user_id, request_body)
    
    # 特定のステータスが設定された譜面の検索処理を行なうAPI
    if request_api_name == "SearchStatusAPI":
        return SearchStatusAPI(user_id, request_body)
    
    # ミラー情報が設定された譜面の検索処理を行なうAPI
    if request_api_name == "SearchMirrorAPI":
        return SearchMirrorAPI(user_id, request_body)
    
    # 譜面に設定された情報の変更処理を行なうAPI
    if request_api_name == "GetChartAPI":
        return GetChartAPI(user_id, request_body)
    
    # 譜面に設定された情報の変更処理を行なうAPI
    if request_api_name == "ChangeInformationAPI":
        return ChangeInformationAPI(user_id, request_body)
    
    # 名前の変更処理を行なうAPI
    if request_api_name == "ChangeNameAPI":
        return ChangeNameAPI(user_id, request_body)
    
    # ログアウト処理を行なうAPI
    if request_api_name == "LogoutAPI":
        return LogoutAPI(user_id)
    
    
    # 想定されていないAPI名が渡された場合
    return {
        "statusCode": 400,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            #"Access-Control-Allow-Credentials": "true"
        },
        "body": json.dumps({
            "message":"f{request_api_name} does not exist."
        })
    }