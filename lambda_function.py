import json
import boto3
import urllib.parse
import base64
from datetime import datetime, timezone
import re
import requests
import json

REKOGNITION = boto3.client('rekognition')
REGION = "ap-northeast-1"

def lambda_handler(event, context):
    data = event['body-json']
    
    values = data.split('\r\n')#必要な部分だけをsplitで切り取る
    lat = values[3]
    lng = values[7]
    print(lat,lng)
    
    API_KEY = "bb5e36ae6e1dbcafd217d7f0411b2523"

    url = f"pro.openweathermap.org/data/2.5/forecast/hourly?lat={lat}&lon={lng}&appid={API_KEY}"
    print(url)
    response = requests.get(url)
    data = response.json()
    jsonText = json.dumps(data, indent=4)
    print(jsonText)
    
    #戻り値
    return {
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin' : '*' ,
        'Content-Type' :'application/json'},
        'body': '{"message":"'+ "hello" + '"}'
    }

