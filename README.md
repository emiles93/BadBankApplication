##Bad Bank Application (Front-End)
## Deployment

This project is deployed on AWS S3. Follow the steps below to deploy your own version:

1. **Create an S3 Bucket**:
   - Log in to the [AWS Management Console](https://aws.amazon.com/).
   - Navigate to the S3 service and create a new bucket.
   - Name your bucket and select the region.

2. **Configure Bucket Policy for Public Access**:
   - Go to the "Permissions" tab of your bucket.
   - Edit the "Bucket policy" and add the following policy, replacing `YOUR_BUCKET_NAME` with your bucket's name:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
         }
       ]
     }
     ```

3. **Enable Static Website Hosting**:
   - In the "Properties" tab, enable "Static website hosting".
   - Set `index.html` as the index document and optionally set an error document.

4. **Upload Files**:
   - Go to the "Objects" tab.
   - Click "Upload", add your project files, and click "Upload".

5. **Access Your Website**:
   - Find the "Bucket website endpoint" URL in the "Properties" tab and open it in your browser.

## Usage

- **Create Account**:
  - Navigate to the "Create Account" page.
  - Fill in your name, email address, username, and password.
  - Click the "Create Account" button. You will see a success message and an option to add another account.

- **Login**:
  - Navigate to the "Login" page.
  - Enter your username and password (must be at least 8 characters).
  - Click the "Login" button to access your account.

- **Deposit**:
  - Navigate to the "Deposit" page.
  - Enter the amount to deposit.
  - Click the "Deposit" button. Your balance will be updated and a success message will be displayed.

- **Withdraw**:
  - Navigate to the "Withdraw" page.
  - Enter the amount to withdraw.
  - Click the "Withdraw" button. Your balance will be updated and a success message will be displayed.

- **View Transactions**:
  - Navigate to the "Transactions" page to view your transaction history.

- **View All Data**:
  - Navigate to the "All Data" page to view all user submissions and details.

## Development

### Prerequisites

- A modern web browser
- AWS account for deployment

### Installation

1. Clone the repository or download the project files.
2. Open the `index.html` file in your browser to run the application locally.

### Technologies Used

- HTML
- CSS
- JavaScript
- Bootstrap (for styling and responsive design)
- AWS S3 (for deployment)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

Thanks to the learning facilitators and resources provided during the course for making this project possible.

