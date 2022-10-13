provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "terraform-state-storage-863362256468" // TODO replace <PRD_AWS_ACCT_NUM>
    dynamodb_table = "terraform-state-lock-863362256468"    // TODO replace <PRD_AWS_ACCT_NUM>
    key            = "sg738-fav-color-ui/prd/app.tfstate"   // TODO replace <APP_NAME>
    region         = "us-west-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  required_version = ">= 0.13.3"
}

locals {
  app_name = "sg738-fav-color-ui"
  url      = "${local.app_name}.byu.edu"
  default_tags = {
    repo             = "https://github.com/byu-oit/sg738-fav-color-ui"
    app              = local.app_name
    team             = "OIT-BYU-APPS-CUSTOM"
    data-sensitivity = "confidential"
    env              = "prd"
  }
}

module "acs" {
  source = "github.com/byu-oit/terraform-aws-acs-info?ref=v3.1.0"
}

data "aws_route53_zone" "hosted_zone" {
  name = local.url
}

module "s3_site" {
  source         = "github.com/byu-oit/terraform-aws-s3staticsite?ref=v6.0.0"
  site_url       = local.url
  hosted_zone_id = data.aws_route53_zone.hosted_zone.zone_id
  s3_bucket_name = "${local.app_name}.byu.edu"

  tags = local.default_tags
}

output "s3_bucket" {
  value = module.s3_site.site_bucket.bucket
}

output "cf_distribution_id" {
  value = module.s3_site.cf_distribution.id
}
