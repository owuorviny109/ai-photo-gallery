# AI Photo Gallery

A serverless AI-powered photo gallery that automatically analyzes and tags uploaded images using AWS Rekognition. Built with React frontend and AWS serverless backend.

![AI Photo Gallery](https://img.shields.io/badge/AWS-Serverless-orange) ![React](https://img.shields.io/badge/React-18-blue) ![Terraform](https://img.shields.io/badge/Terraform-Infrastructure-purple) ![Free Tier](https://img.shields.io/badge/AWS-Free%20Tier%20Friendly-green)

## Features

- **Secure Image Upload** - Direct-to-S3 uploads using presigned URLs
- **AI Image Analysis** - Automatic object/scene detection using AWS Rekognition
- **Smart Tagging** - AI-generated labels with confidence scores
- **Gallery View** - Responsive grid layout showing all analyzed images
- **Serverless Architecture** - Scales automatically, pay only for what you use
- **Free Tier Friendly** - Designed to stay within AWS free tier limits
- **Security First** - Presigned URLs for secure image uploads and viewing

## Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   React App     │───▶│ API Gateway  │───▶│ Upload Lambda   │
│  (Frontend)     │    │              │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Gallery API   │◀───│  DynamoDB    │◀───│   S3 Bucket     │
│    Lambda       │    │   (Labels)   │    │   (Images)      │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │ Analyze Lambda  │
                                            │ + Rekognition   │
                                            └─────────────────┘
```

## Demo & Screenshots

### Upload Interface
The application features a clean, intuitive upload interface where users can select and upload images for AI analysis.

![Upload Interface](https://github.com/owuorviny109/ai-photo-gallery/blob/main/screenshots/upload-interface.png)

*Clean upload form with file selection and progress feedback*

### AI Analysis Results
Once uploaded, images are automatically analyzed by AWS Rekognition, which detects objects, scenes, people, and other elements with confidence scores.

![AI Analysis Gallery](https://github.com/owuorviny109/ai-photo-gallery/blob/main/screenshots/gallery-analysis.png)

*Gallery showing analyzed images with AI-generated labels and confidence percentages*

### Sample Analysis Results

The AI successfully identifies various elements in different types of images:

**Wildlife & Nature:**
- Animal (99.36%), Bird (99.36%), Blackbird (99.36%)
- Railing (98.82%), Handrail (91.25%), Finch (82.31%)

**Interior Design:**
- Furniture (100%), Table (100%), Tabletop (100%)
- Dining Table (99.98%), Architecture (99.98%), Building (99.98%)

**Documents & Text:**
- Page (99.99%), Text (99.99%)
- Advertisement (99.99%), Poster (99.99%), File (86.98%)

**Maps & Charts:**
- Chart (99.6%), Plot (99.6%), Ice (98.1%)
- Nature (92.4%), Outdoors (92.4%), File (91.98%)

**People & Portraits:**
- Adult (99.67%), Female (99.67%), Person (99.67%)
- Woman (99.67%), Face (96.51%), Head (96.51%)
- Body Part (100%), Face (100%), Head (100%), Neck (100%)

### Key Features Demonstrated

1. **High Accuracy**: Confidence scores consistently above 90% for clear object detection
2. **Diverse Recognition**: Successfully identifies animals, furniture, documents, people, and architectural elements
3. **Detailed Analysis**: Provides specific subcategories (e.g., "Blackbird" rather than just "Bird")
4. **Multiple Labels**: Each image receives multiple relevant labels for comprehensive tagging
5. **Real-time Processing**: Images are analyzed and displayed within seconds of upload

## Quick Start

### Prerequisites

- AWS Account with CLI configured
- Node.js 18+ and npm
- Terraform 1.3+
- Python 3.9+

### 1. Clone & Setup

```bash
git clone https://github.com/owuorviny109/ai-photo-gallery.git
cd ai-photo-gallery
```

### 2. Configure AWS

```bash
# Configure your AWS credentials
aws configure

# Create terraform.tfvars (use your own values)
echo 'aws_region = "us-east-1"' > terraform.tfvars
echo 'project_name = "your-name-ai-photo-gallery"' >> terraform.tfvars
```

### 3. Deploy Infrastructure

```bash
# Initialize and deploy AWS resources
terraform init
terraform plan
terraform apply
```

### 4. Setup Frontend

```bash
cd ai-photo-gallery-ui
npm install

# Update src/Gallery.jsx with your API endpoint from terraform output
# Replace GALLERY_API_URL with your actual endpoint

npm run dev
```

### 5. Open & Test

Visit `http://localhost:5173` and start uploading images!

## Project Structure

```
ai-photo-gallery/
├── README.md                    # This file
├── .gitignore                   # Security-focused ignore rules
├── main.tf                      # Main Terraform configuration
├── variables.tf                 # Terraform variables
├── outputs.tf                   # Terraform outputs
├── s3.tf                        # S3 bucket configuration
├── lambda.tf                    # Analyze Lambda configuration
├── iam.tf                       # IAM roles and policies
├── dynamodb.tf                  # DynamoDB table configuration
├── apigw.tf                     # API Gateway configuration
├── upload-lambda.tf             # Upload Lambda configuration
├── gallery-api.tf               # Gallery API configuration
├── analyze-image/               # Image analysis Lambda
│   └── index.py
├── upload-lambda/               # Upload URL Lambda
│   └── index.py
├── gallery-lambda/              # Gallery API Lambda
│   └── index.py
├── ai-photo-gallery-ui/         # React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── Gallery.jsx          # Gallery display component
│   │   ├── UploadForm.jsx       # Upload form component
│   │   └── main.jsx             # App entry point
│   └── public/
└── reprocess_images.py          # Utility script
```

## AWS Services Used

| Service | Purpose | Free Tier Limit |
|---------|---------|-----------------|
| **S3** | Image storage | 5GB storage, 20K GET, 2K PUT requests |
| **Lambda** | Serverless functions | 1M requests, 400K GB-seconds |
| **API Gateway** | REST API endpoints | 1M API calls |
| **DynamoDB** | Metadata storage | 25GB storage, 25 RCU/WCU |
| **Rekognition** | AI image analysis | 5,000 images analyzed |
| **IAM** | Access management | Free |

## Configuration

### Environment Variables

The system uses these environment variables in Lambda functions:

- `DDB_TABLE` - DynamoDB table name
- `BUCKET_NAME` - S3 bucket name for images
- `S3_BUCKET` - S3 bucket name (gallery API)

### Customization

1. **Change AI Analysis**: Modify `analyze-image/index.py` to adjust:
   - `MaxLabels` (default: 15)
   - `MinConfidence` (default: 70%)

2. **Frontend Styling**: Update Tailwind CSS classes in React components

3. **Add Features**: Extend with search, filtering, or image deletion

## Security Features

- Presigned URLs for secure uploads/downloads
- Private S3 bucket (no public access)
- IAM least-privilege permissions
- CORS properly configured
- No hardcoded credentials
- Comprehensive .gitignore

## Cost Estimation

**Monthly costs (after free tier):**
- S3: ~$0.02 per GB stored
- Lambda: ~$0.20 per 1M requests
- DynamoDB: ~$0.25 per GB stored
- Rekognition: ~$0.001 per image
- API Gateway: ~$3.50 per 1M requests

**Typical usage**: $0.00 - $5.00/month for personal use

## Troubleshooting

### Common Issues

1. **Upload fails with 403**
   - Check IAM permissions for Lambda execution role
   - Verify S3 bucket CORS configuration

2. **Images not appearing in gallery**
   - Check Lambda logs: `aws logs describe-log-groups`
   - Verify DynamoDB table has data: `aws dynamodb scan --table-name TABLE_NAME`

3. **Frontend shows "No images"**
   - Update Gallery.jsx with correct API endpoint
   - Check browser console for CORS errors

### Debug Commands

```bash
# Check Terraform outputs
terraform output

# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/your-project"

# Check DynamoDB data
aws dynamodb scan --table-name your-table-name --select COUNT

# List S3 objects
aws s3 ls s3://your-bucket-name/
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- AWS for providing excellent serverless services
- React team for the amazing frontend framework
- Terraform for infrastructure as code
- The open source community

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include logs and error messages

---

**Built using AWS Serverless Architecture**

*Remember to stay within AWS free tier limits to avoid unexpected charges!*