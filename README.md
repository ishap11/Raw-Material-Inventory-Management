# RAW-MATERIAL-INVENTORYI-MANAGEMENT

<!-------------------------------------------------------------------------------------------------------------------------------------->

<div id="top"></div>

## TABLE OF CONTENTS

- [Description](#description)
- [About JsonPowerDB & Benefits of Using JsonPowerDB](#benefits-of-JSDB)
- [Features](#features)
- [Technology Used](#technology-used)
- [Navigation Buttons ](#navigation-buttons)
- [Control Buttons](#control-buttons)
- [Project Status](#project-status)
- [Sources](#sources)

<!-------------------------------------------------------------------------------------------------------------------------------------->

## Description
A web application is designed to efficiently manage the inventory of raw materials for a manufacturing unit. It provides a user-friendly interface to add, update, and track raw material items, ensuring smooth stock management. The application includes various features such as item addition, item receipt, and item issue, with complete validation and reporting functionality.
<br>

<!-- --------------------------------------------------------------------------------------------------------------------------------------------------------- -->

## About JsonPowerDB & Benefits of Using JsonPowerDB

JsonPowerDB is a Real-time, High Performance, Lightweight and Simple to Use, Rest API based Multi-mode DBMS. JsonPowerDB has ready to use API for Json document DB, RDBMS, Key-value DB, GeoSpatial DB and Time Series DB functionality. JPDB supports and advocates for true serverless and pluggable API development.

- **Fast and Efficient**: JsonPowerDB offers high-speed performance due to its in-memory data processing capabilities.
- **Flexibility**: It supports various types of data manipulations, including querying, updating, and deleting, using simple JSON queries.
- **Ease of Use**: JsonPowerDB's JSON-based querying language is straightforward and easy to learn, simplifying database interactions.
- **Scalability**: Designed to handle large amounts of data efficiently, making it suitable for applications with growing data needs.
  
<!-- --------------------------------------------------------------------------------------------------------------------------------------------------------- -->

## Features 

-Item Management:
Add or edit raw materials.
Fields include: Item ID, Item Name, Opening Stock, and Unit of Measurement (UoM).
Validates if Item ID exists in the database and loads existing details. If not present, allows the creation of a new item.

-Item Received (Inward):
Manage items received into the store.
Fields include: Receipt No, Receipt Date, Item ID, and Quantity Received.
Checks if the entered receipt number or item exists in the database. Displays relevant details for valid entries and handles validation errors.

-Item Issued (Outward):
Manage items issued from the store for production.
Fields include: Issue No, Issue Date, Item ID, and Quantity Issued.
Ensures that issued quantity does not exceed available stock, with validation and error handling for non-existent items or excessive quantity entries.

-Item Report:
Generate reports on the stock of items within a given range of Item IDs.
Displays Item ID, Item Name, and Current Stock in a tabular format for better inventory tracking.

-Stock Management Dashboard:
Centralized navigation system with a common header, footer, and left-side navigation menu.
Easily access different pages (Item Management, Item Received, Item Issued, Item Report) based on the user’s selection.

<!-- --------------------------------------------------------------------------------------------------------------------------------------------------------- -->

## Technology Used

<p>
  <a href="https://www.w3schools.com/html/"> <img src="https://img.icons8.com/color/70/000000/html-5--v1.png" alt="HTML" /></a>
  <a href="https://www.w3schools.com/css/"> <img src="https://img.icons8.com/color/70/000000/css3.png" alt="CSS" /></a>
  <a href="https://www.w3schools.com/js/"><img src="https://img.icons8.com/color/70/000000/javascript--v1.png" alt="JS" /></a>
  <a href="https://www.w3schools.com/js/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQML--tf-oIjbL6kkH4wN9D4FqSUixM1aBovQ&s" alt="jQuery" height="80px"  width="80px" /></a>
     <a href="https://www.w3schools.com/js/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNUwj31PQCq8q6WU1rZB-hUxLNKj5j2A8gg&s" alt="AJAX"height="80px"  width="80px /></a>" alt="AJAX" /></a>
  <a href="https://www.w3schools.com/js/"><img src="https://media.licdn.com/dms/image/D4D22AQE6KGrO7C3E0A/feedshare-shrink_2048_1536/0/1701452875140?e=2147483647&v=beta&t=hsgF3TdGmjJtIHTMO78C8fSLjpClfaS6ISdsDi4eKig" alt="JS" height="80px"  width="80px"/></a>

</p>
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- --------------------------------------------------------------------------------------------------------------------------------------------------------- -->

## Video
---
## Navigation Buttons

- **First**: Navigate to the first employee record in the database.
- **Previous**: Navigate to the previous employee record relative to the current record.
- **Next**: Navigate to the next employee record relative to the current record.
- **Last**: Navigate to the last employee record in the database.

<!-- --------------------------------------------------------------------------------------------------------------------------------------------------------- -->

## Control Buttons

- **New**: Prepare the form for new data entry by clearing existing data.
- **Save**: Save the current form data as a new record or update an existing record.
- **Edit**: Enter edit mode to modify the current record.
- **Change**: Apply changes to the current record with updated details.
- **Reset**: Return the form to its initial state, clearing all fields and disabling editing.    
     
<!-- --------------------------------------------------------------------------------------------------------------------------------------------------------- -->

## Project Status

Currently in development with version 1.2.0 integrating JsonPowerDB. Future updates will focus on additional features and enhancements based on user feedback.
-Add authentication and user role management.
-Provide more detailed analytics and reporting.
-Implement a notification system for low stock alerts.

<!-- --------------------------------------------------------------------------------------------------------------------------------------------------------- -->

## Sources

[JsonPowerDB Documentation](https://login2explore.com/jpdb/docs.html) :  Comprehensive documentation for JsonPowerDB, including setup, queries, and API references.🌟

  <p align="right">(<a href="#top">back to top</a>)</p>
  
