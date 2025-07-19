output "upload_api_endpoint" {
  value = aws_apigatewayv2_api.upload_api.api_endpoint
}

output "gallery_api_endpoint" {
  value = aws_apigatewayv2_api.gallery_api.api_endpoint
}

output "s3_image_bucket" {
  value = aws_s3_bucket.image_bucket.id
}

output "dynamodb_table" {
  value = aws_dynamodb_table.images.name
}
