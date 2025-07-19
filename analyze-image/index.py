import json
import boto3
import os
from datetime import datetime
import urllib.parse
from decimal import Decimal

rekognition = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DDB_TABLE'])

def lambda_handler(event, context):
    print("Event received:", json.dumps(event))
    
    for record in event['Records']:
        try:
            bucket = record['s3']['bucket']['name']
            key = urllib.parse.unquote_plus(record['s3']['object']['key'])
            
            print(f"Processing image: {bucket}/{key}")

            # Call Rekognition to detect labels
            response = rekognition.detect_labels(
                Image={'S3Object': {'Bucket': bucket, 'Name': key}},
                MaxLabels=15,
                MinConfidence=70
            )

            # Extract labels with confidence scores (using Decimal for DynamoDB)
            labels = []
            for label in response['Labels']:
                labels.append({
                    'name': label['Name'],
                    'confidence': Decimal(str(round(label['Confidence'], 2)))
                })

            # Generate presigned URL for viewing (valid for 1 hour)
            s3_client = boto3.client('s3')
            image_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': bucket, 'Key': key},
                ExpiresIn=3600
            )

            # Store in DynamoDB
            item = {
                'image_id': key,
                'labels': labels,
                'timestamp': datetime.utcnow().isoformat(),
                'image_url': image_url,
                'bucket': bucket,
                'file_size': record['s3']['object'].get('size', 0)
            }
            
            table.put_item(Item=item)
            print(f"Successfully processed {key} with {len(labels)} labels")

        except Exception as e:
            print(f"Error processing {key}: {str(e)}")
            # Continue processing other records even if one fails
            continue

    return {
        'statusCode': 200,
        'body': json.dumps('Images processed successfully!')
    }
