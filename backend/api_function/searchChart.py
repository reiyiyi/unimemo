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


def SearchChartAPI(user_id, request_body):
    difficulty = request_body["difficulty"]
    level = request_body["level"]
    genre = request_body["genre"]
    
    response = list()
    
    try:
        if level and genre:
            # レベルとジャンルが指定されている場合
            response = dynamodb.query(
                TableName = TABLE_NAME,
                IndexName = SEARCH_INDEX_NAME,
                KeyConditionExpression = "setting_info = :setting_info_val and chart_info = :chart_info_val",
                ExpressionAttributeValues = {
                    ":setting_info_val": {"S": f"{user_id}#{difficulty}"},
                    ":chart_info_val": {"S": f"{genre}#{level}"}
                },
            )
        elif level:
            # レベルのみ指定されている場合
            response = dynamodb.query(
                TableName = TABLE_NAME,
                IndexName = LEVEL_INDEX_NAME,
                KeyConditionExpression = "setting_info = :setting_info_val and level = :level_val",
                ExpressionAttributeValues = {
                    ":setting_info_val": {"S": f"{user_id}#{difficulty}"},
                    ":level_val": {"S": level}
                },
            )
        elif genre:
            # ジャンルのみ指定されている場合
            response = dynamodb.query(
                TableName = TABLE_NAME,
                IndexName = SEARCH_INDEX_NAME,
                KeyConditionExpression = "setting_info = :setting_info_val and begins_with( chart_info, :chart_info_val )",
                ExpressionAttributeValues = {
                    ":setting_info_val": {"S": f"{user_id}#{difficulty}"},
                    ":chart_info_val": {"S": f"{genre}#"}
                },
            )
        else:
            # レベルもジャンルも指定されていない場合
            response = dynamodb.query(
                TableName = TABLE_NAME,
                IndexName = SEARCH_INDEX_NAME,
                KeyConditionExpression = "setting_info = :setting_info_val",
                ExpressionAttributeValues = {
                    ":setting_info_val": {"S": f"{user_id}#{difficulty}"}
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
            'search_result': response["Items"]
        })
    }
    