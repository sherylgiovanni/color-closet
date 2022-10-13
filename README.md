# About the Application
<b>Color Closet</b> is a simple Nuxt.js application that utilizes API calls to create, read, update, and delete student's favorite color. The information is stored in AWS DynamoDB. This application is created to pass off the BYU OIT Full-stack Training. 

When you first open the application, you will be prompted to log in using your BYU Net ID and password. Once done, you will see a list of students whose favorite colors are already stored in the database. <br>
![image](https://user-images.githubusercontent.com/63915889/181643688-9c46c8d6-5bd3-4f30-be41-659143df41b7.png)

You can add a new student along with their favorite color and name to the application. <b>All these fields are mandatory</b>, and you must make sure to put in a 7-digit BYU ID. Once you save it, the application will call a POST request to the endpoint and persist the new entry to the database. <br>
![image](https://user-images.githubusercontent.com/63915889/181643891-978fb00d-5f6c-42bd-aa0b-8d8adee7b4b5.png)

You may also edit existing student's favorite color and delete them as you wish. Be very careful when deleting because there is no going back! <br>
![image](https://user-images.githubusercontent.com/63915889/181643969-3c7166d4-dde0-46ff-9458-c4cdfaf375c4.png)

If you add a BYU ID after the link (such as /111222333), you will see a specific student's favorite color card. But if they have never logged their favorite color, you will see a short message. <br>
![image](https://user-images.githubusercontent.com/63915889/181644129-d5433cc7-74ec-4b59-99ec-e93568868c1b.png)
![image](https://user-images.githubusercontent.com/63915889/181644170-858732ae-46bc-4db2-ae86-245d7958c2ef.png)

Have fun tweaking each other's favorite color!

<hr> 

# Project Setup

### Initial Setup

1) Click the Green *Use this template* button at the top of the template repository. Then clone the repository and checkout a new branch called `dev`.
2) Setup GitHub secrets
    1) Use this [order form](https://it.byu.edu/it?id=sc_cat_item&sys_id=d20809201b2d141069fbbaecdc4bcb84) to give your repo access to the secrets that will let it deploy into your AWS accounts. Fill out the form twice to give access to both your `dev` and `prd` accounts.
    2) Go to [codecov.io](https://codecov.io), login with your GitHub account, find your repo and copy the token.
        1) Copy the codecov token and [upload it to your github repo's secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) with the name of `codecov_token`
        2) __(Optional)__ Add the Codecov badge (found under Settings->Badge in codecov for you repo) to the badge table at the top of this README. The badge copied from Codecov is only for master, but you can use the same code for the dev branch by replacing `master` with `dev`.  
3) Create 2 new applications in Tyk (one in sandbox for dev and one in production for prd).
    The application name should be something simple and unique (maybe the name of your repo) and the callback URL should be what you put inside your [app-dev.tf](terraform/dev/app/app-dev.tf) and [app-prd.tf](terraform/prd/app/app-prd.tf) files for `local.url` variable (be sure to include the protocol and trailing slash).
   1) Enable 'Implicit Grant Type' in the 'Deprecated Options'. Be sure to set the right callback URL.
4) AWS Setup *(this will create Route53 hosted zones in your aws accounts and upload SSM params)*
    1) Create 2 terraform variable files (these files are gitignored) in `/terraform/dev/setup/dev.tfvars` (use the dev client_id and callback from step #6) and `/terraform/prd/setup/prd.tfvars` (use the prd client_id and callback from step #6):
        ```hcl
        client_id = "<CLIENT_ID>"
        callback_url = "<CALLBACK_URL>"
        // custom_domain = "custom-domain.byu.edu" // OPTIONAL. Only required if you want a custom domain name.
        // app_dynamics_key = "<APP_DYNAMICS_KEY>" // OPTIONAL. See the "AppDynamics Setup" for instructions how to get the key.
        ```
    2) Update the TODO items in `/terraform/dev/setup/setup-dev.tf` and `/terraform/dev/setup/setup-prd.tf`
    3) Run terraform to setup the DEV environment
        1) Run `awslogin` and login to the dev account you want to deploy to.
        2) Run setup which uploads SSM parameters:
            ```bash
            cd terraform/dev/setup
            terraform init
            terraform apply -var-file=dev.tfvars
            ```
        3) Use [this order form](https://it.byu.edu/it/?id=sc_cat_item&sys_id=2f7a54251d635d005c130b6c83f2390a) to request having your dev subdomain added to BYU's DNS servers.
           Add yourself as the technical contact, select Cname, and list the NS records found in Route 53 (from above step) in the "Aliases" field.
    4) Run terraform to setup the PRD environment
        1) Run `awslogin` and login to the prd account you want to deploy to.
        2) Run setup which uploads SSM parameters:
            ```bash
            cd ../../prd/setup
            terraform init
            terraform apply -var-file=prd.tfvars
            ```
        3) **NOTE** if you're transferring an existing URL to a new Account see the [instructions below](#using-an-exisiting-domain-name) instead
        3) Use [this order form](https://it.byu.edu/it/?id=sc_cat_item&sys_id=2f7a54251d635d005c130b6c83f2390a) to request having your dev subdomain added to BYU's DNS servers.
           Add yourself as the technical contact, select Cname, and list the NS records found in Route 53 (from above step) in the "Aliases" field.
5) Now we have to wait for the order forms to be completed by the networking team. 
While waiting you can update the code in the repo:
    1) Customize this README.
    2) Change the Name, Description, and Author in package.json.
    3) Cycle through the **TODO**s to update (any TODOs that don't talk about replacing can be deleted. They are TODOs for this template only.)
        - `<APP_NAME>` - typically your repo name (keep it short if you can, there tends to be issues with longer names with some AWS resources)
        - `<REPO_NAME>` - The full URL of the project's repository.
        - `<DEV_AWS_ACCT_NUM>` - the AWS account number for your dev account
        - `<PRD_AWS_ACCT_NUM>` - the AWS account number for your prd account
        - `<GITHUB_AWS_DEV_KEY_NAME>` - the name of the GitHub secret for dev AWS key (i.e. `byu_oit_customapps_dev_key`)
        - `<GITHUB_AWS_DEV_SECRET_NAME>` - the name of the GitHub secret for dev AWS secret (i.e. `byu_oit_customapps_dev_secret`)
        - `<GITHUB_AWS_PRD_KEY_NAME>` - the name of the GitHub secret for prd AWS key (i.e. `byu_oit_customapps_prd_key`)
        - `<GITHUB_AWS_PRD_SECRET_NAME>` - the name of the GitHub secret for prd AWS secret (i.e. `byu_oit_customapps_prd_secret`)
        - `<STD_CHANGE_TEMPLATE_ID>` - WHEN READY FOR PRODUCTION: In ServiceNow, create a new standard change template and be sure to give it an alias, put that alias here
        - the page/site title
        - the dependabot [config.yml](.dependabot/config.yml) file

6) **Wait** until the order forms are completed and DNS is routed to your AWS hosted zones. This could take a few hours to a day.
7) Push your changes to your GitHub repo master branch (and dev branch)
    * this should start the pipeline worklfows (dev and prd), which will each take 15-30 minutes to spin up the CloudFront distributions
8) If all was successful, your site should be available at both dev and prd URLs 
   
