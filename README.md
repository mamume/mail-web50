# Mail
Email client to send and receive emails.

## Description
A front-end single-page-app for an email client using JavaScript, HTML, and CSS, that makes API calls to send and receive emails using Django.

## Installation
 ```
 pip install -r requirement.txt
 ```

## Database Processing
 ```
 python mange.py makemigrations
 python manage.py migrate
 ```
 
## Run Project
```
python manage.py runserver
```

## Specification
  - **Send Mail**: When a user submits the email composition form, a JavaScript code send the email.
     - A `POST` request is sent to `/emails`, passing in values for `recipients`, `subject`, and `body`.
     - Once the email has been sent, the user’s sent mailbox will be loaded.
  - **Mailbox**: When a user visits their Inbox, Sent mailbox, or Archive, the appropriate mailbox will be loaded.
     - A `GET` request is sent to `/emails/<mailbox>` to request the emails for a particular mailbox.
     - When a mailbox is visited, the application first queries the API for the latest emails in that mailbox.
     - When a mailbox is visited, the name of the mailbox will appear at the top of the page.
     - Each email will then be rendered in its own box that displays who the email is from, what the subject line is, and the timestamp of the email.
     - If the email is unread, it will appear with a white background. If the email has been read, it will appear with a gray background.
   - **View Email**: When a user clicks on an email, the user will be taken to a view where they see the content of that email.
     - A `GET` request is sent to `/emails/<email_id>` to request the email.
     - The application will show the email’s sender, recipients, subject, timestamp, and body.
     - An additional `div` will be added to `inbox.html` (in addition to `emails-view` and `compose-view`) for displaying the email. The code will be updated to hide and show the right views when navigation options are clicked.
     - Once the email has been clicked on, The email will be marked as read. A `PUT` request is sent to `/emails/<email_id>` to update whether an email is read or not.
   - **Archive and Unarchive**: Allow users to archive and unarchive emails that they have received.
      - When viewing an Inbox email, the user will be presented with a button that lets them archive the email. When viewing an Archive email, the user will be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
      - A `PUT` request is sent to `/emails/<email_id>` to mark an email as archived or unarchived.
      - Once an email has been archived or unarchived, the user’s inbox will be loaded.
   - **Reply**: Allow users to reply to an email.
      - When viewing an email, the user will be presented with a “Reply” button that lets them reply to the email.
      - When the user clicks the “Reply” button, they will be taken to the email composition form.
      - The composition form is pre-filled with the `recipient` field set to whoever sent the original email.
      - The `subject` line is pre-filled. If the original email had a subject line of foo, the new subject line will be `Re: foo`. (If the subject line already begins with `Re: `, it will not be added again.)
      - The `body` of the email is pre-filled with a line like `"On Dec 4 2021, 12:00 AM foo@example.com wrote:"` followed by the original text of the email.

*For more details: [Mail - CS50's Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/projects/3/mail/)*
