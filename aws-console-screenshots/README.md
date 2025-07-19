# AWS Console Screenshots

This folder contains screenshots from the AWS Management Console showing the deployed infrastructure and services for the AI Photo Gallery project.

## Screenshots Overview

These screenshots provide technical evidence of the working AWS infrastructure:

### Core Services
- **S3 Buckets**: Image storage and frontend hosting buckets
- **Lambda Functions**: Serverless compute functions for upload, analysis, and gallery APIs
- **DynamoDB**: NoSQL database storing image metadata and AI analysis results
- **API Gateway**: REST API endpoints for frontend communication

### Additional Services
- **IAM Roles**: Security roles and policies for service permissions
- **CloudWatch Logs**: Execution logs showing successful processing
- **Rekognition**: AI service integration (if applicable)

## Technical Proof Points

These screenshots demonstrate:

1. **Multi-Service Architecture**: Integration of 6+ AWS services
2. **Serverless Implementation**: Lambda-based compute without servers
3. **Data Storage**: Both object storage (S3) and NoSQL database (DynamoDB)
4. **Security**: Proper IAM roles and policies
5. **Monitoring**: CloudWatch logging for observability
6. **API Management**: RESTful endpoints with proper routing

## Infrastructure Scale

- **Lambda Functions**: 3 serverless functions
- **S3 Buckets**: 2 buckets (images + frontend)
- **DynamoDB**: 1 table with analyzed image data
- **API Gateway**: 2 APIs with multiple routes
- **IAM**: Custom roles with least-privilege permissions

## Cost Optimization

All services configured for:
- Pay-per-use billing (Lambda, DynamoDB)
- Free tier compatibility
- Automatic scaling based on demand
- No idle resource costs

---

*Screenshots taken before infrastructure destruction to preserve evidence of working deployment.*