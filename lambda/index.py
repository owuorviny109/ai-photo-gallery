import json
import boto3
import os

rekognition = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DDB_TABLE'])

def lambda_handler(event, context):
    print("Event received:", json.dumps(event))
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        # Call Rekognition to detect labels
        response = rekognition.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=10
        )

        labels = [label['Name'] for label in response['Labels']]

        # Store in DynamoDB
        table.put_item(Item={
            'image_id': key,
            'labels': labels
        })

    return {
        'statusCode': 200,
        'body': json.dumps('Image processed successfully!')
    }
