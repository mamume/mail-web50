document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  // By default, load the inbox
  load_mailbox('inbox');

  // If send email button is clicked
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // Hide alert divs
  document.querySelectorAll('.alert').forEach((alert) => alert.style.display = 'none');
});

function compose_email(recipients = '', subject = '', body = '') {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  console.log(recipients);

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;

  // Hide alert divs
  document.querySelectorAll('.alert').forEach((alert) => alert.style.display = 'none');
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Hide alert divs
  document.querySelectorAll('.alert').forEach((alert) => alert.style.display = 'none');

  // Get Emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {

      // Display Emails
      emails.forEach(email => {
        // Creaete Email card
        const element = document.createElement('div');

        // Insert email details
        element.innerHTML = `
          <div class="card border-dark mb-3">
            <h5 class="card-header">
              <small class="text-muted">${email.timestamp}</small>
            </h5>
            <div class="card-body text-dark">
              <h5 class="card-title">Subject: ${email.subject}</h5>
              <p class="card-text">From: ${email.sender}</p>
              <a href="#" class="btn btn-primary open-mail">Open</a>
            </div>
          </div>
        `;

        // If email is read change background into grey
        if (email.read)
          element.children[0].style.background = "#E7E7E7";

        // Load archive button only if not sent box
        if (mailbox !== 'sent') {
          // Create archive button
          const archiveBtn = document.createElement('button');
          // Add bootstrap class
          archiveBtn.className = "btn btn-warning";
          // Button text depends on inbox or archived
          archiveBtn.innerHTML = mailbox === 'inbox' ? 'Archive' : 'Unarchive';

          // Add event listener on archive button to archive/unarchive email
          archiveBtn.addEventListener('click', () => archiveMail(email, email.archived));
          // Append button to end of the email element
          element.lastElementChild.lastElementChild.append(archiveBtn);
        }

        // Append email card into DOM
        document.querySelector('#emails-view').append(element);

        // Add event listener on click on email button
        element.querySelector('.open-mail').addEventListener('click', () => showMail(email));
      });
    });
}


function send_email(event) {
  // Get data from form.
  const data = {
    recipients: event.target[2].value,
    subject: event.target[3].value,
    body: event.target[4].value
  };

  // Send inputs in a post request using API
  fetch('/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      // Get Key name
      const key = Object.keys(result)[0];

      // Check if sending went successfully
      if (key === 'message') {
        // If yes, load sent section and print message.
        load_mailbox('sent');
        const alert = document.querySelector('.alert-success');
        alert.style.display = 'block';
        alert.innerHTML = result[key];
      } else {
        // If no, only print the error
        const alert = document.querySelector('.alert-danger');
        alert.style.display = 'block';
        alert.innerHTML = result[key];
      }
    });

  // To prevent the page from reloading
  event.preventDefault();
}

// View Email
function showMail(email) {
  // Change email read value to true if it's false
  if (!email.read) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        read: true
      })
    });
  }

  // Create email container div element
  const emailContainer = document.createElement('div');


  // Put email data into email container
  emailContainer.innerHTML = `
    <div class="card border-dark">
      <div class="card-header">From: ${email.sender}</div>
      <div class="card-header">To: ${email.recipients}</div>
      <div class="card-body text-dark">
        <h5 class="card-title">${email.subject}</h5>
        <small class="text-muted">${email.timestamp}</small>
        <p class="card-text" style="white-space: pre-line">${email.body}</p>
      </div>
    </div>
  `;

  // Create reply button
  const replyBtn = document.createElement("a");
  replyBtn.className = "btn btn-primary";
  replyBtn.innerText = 'Reply';
  replyBtn.href = '#';

  // Get current user email from the form
  const userEmail = document.querySelector('#user-email').value;

  // Set the new subject and body
  let subject = email.subject;
  let body = `<i>${email.body}</i>\n\nOn ${new Date().toDateString()} ${userEmail}:\n`;
  // If it's not a replay of a replay alternate subject and body
  if (email.subject.slice(0, 3) !== 'Re:') {
    subject = 'Re: ' + subject;
    body = `On ${email.timestamp} ${email.sender} worte:\n` + body;
  }

  // After click on reply, invoke compose_email function with email data for replay
  replyBtn.addEventListener('click', () => compose_email(
    email.sender,
    subject,
    body
  ));

  // Add replay button in email container
  emailContainer.lastElementChild.lastElementChild.append(replyBtn);

  // Select email view div
  const emailView = document.querySelector('#emails-view');
  // Remove its HTML elements
  emailView.innerHTML = '';
  // Append email container
  emailView.append(emailContainer);
}


// Archive/Unarchive email
function archiveMail(email, value) {

  // Revese the archive state
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      archived: !value
    })
  })
    // Only load inbox after fetch ends
    .then(() => load_mailbox('inbox'));
}