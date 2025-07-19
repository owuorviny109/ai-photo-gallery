resource "aws_dynamodb_table" "images" {
  name         = "${var.project_name}-images"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "image_id"

  attribute {
    name = "image_id"
    type = "S"
  }

  tags = {
    Project = var.project_name
  }
}
