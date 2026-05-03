import boto3
from botocore.exceptions import ClientError
import os
import uuid
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

class S3StorageService:
    def __init__(self):
        self.bucket_name = os.getenv("S3_BUCKET_NAME", "")
        self.endpoint_url = os.getenv("S3_ENDPOINT_URL")

        aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        region_name = os.getenv("AWS_REGION", "eu-central-1")

        if aws_access_key_id and aws_secret_access_key:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key=aws_secret_access_key,
                region_name=region_name,
                endpoint_url=self.endpoint_url if self.endpoint_url else None
            )
            self.configured = True
        else:
            self.s3_client = None
            self.configured = False

    def check_configuration(self):
        if not self.configured or not self.bucket_name:
            raise HTTPException(status_code=500, detail="S3 storage is not properly configured in .env file.")

    def upload_file(self, content: bytes, filename: str, content_type: str = "application/pdf") -> str:
        self.check_configuration()

        file_ext = filename.split(".")[-1] if "." in filename else "pdf"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        s3_key = f"uploads/{unique_filename}"

        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=content,
                ContentType=content_type
            )
            return s3_key
        except ClientError as e:
            print(f"S3 Upload Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload file to S3")

    def get_presigned_url(self, s3_key: str, expiration: int = 3600) -> str:
        self.check_configuration()
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': s3_key},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            print(f"S3 Presigned URL Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate download link")

    def delete_file(self, s3_key: str):
        if not self.configured or not self.bucket_name or not s3_key:
            return
            
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=s3_key
            )
        except ClientError as e:
            print(f"S3 Delete Error: {e}")

storage_service = S3StorageService()
