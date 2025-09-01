# Week Nº 19

## Step by step, line by line — becoming a Full Stack Developer in one year.

## QR Code Generator & My Projects

A simple web application built with Vanilla JavaScript that allows users to generate a QR code from any URL and also displays a list of static projects loaded from a JSON file, each with its own QR code for quick access.

### 📌 Features
- Generate a QR code from any valid URL entered by the user.
- Load static projects from a JSON file and render.
- Input validation to ensure correct URL format.
- Responsive and minimalist UI design.
- Each project card includes: project name and description and QR code pointing directly to the project URL.

### 🧠 Lessons Learned
- How to integrate and use the qrcode library in a browser project.
- DOM manipulation to dynamically create project cards and QR codes.
- Best practices when working with external JSON data (error handling, cache control).
- Use of async/await to handle asynchronous operations like fetch and QR code generation.
- Security considerations for external links (rel="noopener noreferrer").