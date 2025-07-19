resource "aws_lambda_function" "get_upload_url" {
  function_name = "${var.project_name}-get-upload-url"
  runtime       = "python3.9"
  handler       = "index.lambda_handler"
  filename      = "upload-lambda.zip"
  source_code_hash = filebase64sha256("upload-lambda.zip")
  role          = aws_iam_role.lambda_exec.arn
  timeout       = 10

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.image_bucket.id
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}
