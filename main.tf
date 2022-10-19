provider "aws" {
  region                   = var.aws_region
  shared_credentials_files = ["/Users/W700872/.aws/credentials"]
  profile                  = "dev-local"
}