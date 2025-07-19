# Gallery Lambda Function
resource "aws_lambda_function" "gallery_api" {
  function_name = "${var.project_name}-gallery-api"
  runtime       = "python3.9"
  handler       = "index.lambda_handler"
  filename      = "gallery-lambda.zip"
  source_code_hash = filebase64sha256("gallery-lambda.zip")
  role          = aws_iam_role.lambda_exec.arn
  timeout       = 30

  environment {
    variables = {
      DDB_TABLE = aws_dynamodb_table.images.name
      S3_BUCKET = aws_s3_bucket.image_bucket.id
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# API Gateway for Gallery
resource "aws_apigatewayv2_api" "gallery_api" {
  name          = "${var.project_name}-gallery-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_credentials = false
    allow_headers     = ["content-type"]
    allow_methods     = ["GET", "OPTIONS"]
    allow_origins     = ["*"]
    max_age          = 300
  }
}

resource "aws_apigatewayv2_integration" "gallery_integration" {
  api_id                 = aws_apigatewayv2_api.gallery_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.gallery_api.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "gallery_route" {
  api_id    = aws_apigatewayv2_api.gallery_api.id
  route_key = "GET /images"
  target    = "integrations/${aws_apigatewayv2_integration.gallery_integration.id}"
}

resource "aws_apigatewayv2_stage" "gallery_stage" {
  api_id      = aws_apigatewayv2_api.gallery_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_apigw_invoke_gallery" {
  statement_id  = "AllowAPIGWInvokeGallery"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.gallery_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.gallery_api.execution_arn}/*/*"
}