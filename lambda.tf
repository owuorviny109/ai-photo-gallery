resource "aws_lambda_function" "analyze_image" {
  function_name = "${var.project_name}-analyzer"
  handler       = "index.lambda_handler"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_exec.arn
  timeout       = 10

  filename         = "lambda.zip"
  source_code_hash = filebase64sha256("lambda.zip")

  environment {
    variables = {
      DDB_TABLE = aws_dynamodb_table.images.name
    }
  }

  depends_on = [
    aws_iam_role_policy.lambda_policy
  ]
}
resource "aws_lambda_permission" "allow_s3_invoke" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analyze_image.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.image_bucket.arn
}
