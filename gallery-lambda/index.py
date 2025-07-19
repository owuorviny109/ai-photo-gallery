import json
import boto3
import os
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')
table = dynamodb.Table(os.environ['DDB_TABLE'])

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    print("Gallery API Event:", json.dumps(event))
    
    try:
        # Get all images from DynamoDB
        response = table.scan()
        items = response['Items']
        
        # Process and normalize data for each image
        for item in items:
            bucket = item.get('bucket', os.environ.get('S3_BUCKET', 'vinceoy-ai-photo-gallery-images'))
            key = item.get('image_id')
            
            if key:
                # Generate new presigned URL (valid for 1 hour)
                try:
                    item['image_url'] = s3_client.generate_presigned_url(
                        'get_object',
                        Params={'Bucket': bucket, 'Key': key},
                        ExpiresIn=3600
                    )
                except Exception as e:
                    print(f"Error generating presigned URL for {key}: {e}")
                    item['image_url'] = None
                
                # Normalize labels format (handle both old and new formats)
                labels = item.get('labels', [])
                if labels and isinstance(labels[0], str):
                    # Old format: convert string labels to new format
                    item['labels'] = [{'name': label, 'confidence': 85.0} for label in labels]
                elif not labels:
                    item['labels'] = []
                
                # Ensure timestamp exists
                if not item.get('timestamp'):
                    item['timestamp'] = '2025-01-01T00:00:00.000Z'
        
        # Sort by timestamp (newest first)
        items.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'images': items,
                'count': len(items)
            }, cls=DecimalEncoder)
        }
        
    except Exception as e:
        print(f"Error fetching images: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': 'Failed to fetch images',
                'message': str(e)
            })
        }