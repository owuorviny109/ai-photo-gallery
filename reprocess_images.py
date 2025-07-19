import boto3
import json

# Initialize clients
s3_client = boto3.client('s3')
lambda_client = boto3.client('lambda')

# Configuration
bucket_name = 'vinceoy-ai-photo-gallery-images'
lambda_function_name = 'vinceoy-ai-photo-gallery-analyzer'

def reprocess_all_images():
    try:
        # List all objects in the S3 bucket
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        
        if 'Contents' not in response:
            print("No images found in bucket")
            return
        
        for obj in response['Contents']:
            key = obj['Key']
            size = obj['Size']
            
            print(f"Processing: {key}")
            
            # Create the event payload that S3 would normally send
            event_payload = {
                "Records": [
                    {
                        "s3": {
                            "bucket": {
                                "name": bucket_name
                            },
                            "object": {
                                "key": key,
                                "size": size
                            }
                        }
                    }
                ]
            }
            
            # Invoke the Lambda function
            try:
                response = lambda_client.invoke(
                    FunctionName=lambda_function_name,
                    InvocationType='Event',  # Async invocation
                    Payload=json.dumps(event_payload)
                )
                print(f"✅ Triggered analysis for {key}")
            except Exception as e:
                print(f"❌ Failed to process {key}: {e}")
        
        print(f"\n🎉 Triggered analysis for all images. Check DynamoDB in a few minutes.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reprocess_all_images()