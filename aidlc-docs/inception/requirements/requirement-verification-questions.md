# Requirements Verification Questions

Please answer the following questions to help clarify the requirements for the Reading List Tracker web application.

## Question 1
What type of web application architecture do you prefer?

A) Single Page Application (SPA) with frontend framework (React, Vue, Angular)
B) Server-side rendered application (traditional multi-page)
C) Static site with client-side JavaScript
D) Progressive Web App (PWA) with offline capabilities
E) Other (please describe after [Answer]: tag below)

[Answer]: B) Server-side rendered application (traditional multi-page)

## Question 2
Where should the JSON data files be stored?

A) Browser's local storage (data stays on user's device)
B) Server-side file system (centralized storage)
C) Cloud storage service (AWS S3, Google Cloud Storage)
D) IndexedDB (browser database for larger datasets)
E) Other (please describe after [Answer]: tag below)

[Answer]: A) Browser's local storage (data stays on user's device)

## Question 3
Should the application support multiple users?

A) Single user only (personal use)
B) Multiple users with separate reading lists (requires authentication)
C) Multiple users with shared reading lists (collaborative)
D) Other (please describe after [Answer]: tag below)

[Answer]: B) Multiple users with separate reading lists (requires authentication); Just use email id and password to register, no approval needed

## Question 4
What level of reading progress tracking is needed?

A) Simple page count (current page / total pages)
B) Percentage-based progress with visual indicators
C) Detailed tracking with reading sessions and timestamps
D) Chapter-based progress tracking
E) Other (please describe after [Answer]: tag below)

[Answer]: B) Percentage-based progress with visual indicators


## Question 5
What statistics should be displayed?

A) Basic stats only (books per month, reading pace)
B) Comprehensive stats (books per month, reading pace, average rating, genre breakdown, reading streaks)
C) Customizable dashboard with user-selected metrics
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Basic stats only (books per month, reading pace)


## Question 6
How should books be added to the list?

A) Manual entry form (user types all details)
B) ISBN lookup with auto-fill from book database API
C) Import from file (CSV, JSON)
D) All of the above
E) Other (please describe after [Answer]: tag below)

[Answer]: D) All of the above


## Question 7
What rating system should be used?

A) 5-star rating system
B) 10-point scale
C) Simple thumbs up/down
D) Custom rating scale
E) Other (please describe after [Answer]: tag below)

[Answer]: A) 5-star rating system


## Question 8
Should the application include search and filtering capabilities?

A) Basic search by title/author only
B) Advanced filtering (by status, rating, date added, genre)
C) Full-text search including notes
D) No search needed (simple list view)
E) Other (please describe after [Answer]: tag below)

[Answer]: A) Basic search by title/author only


## Question 9
What additional book metadata should be tracked?

A) Just title, author, status, pages, notes, rating (as specified)
B) Add genre, publication year, ISBN
C) Add cover image, publisher, language
D) Comprehensive metadata (all of the above plus tags, series info)
E) Other (please describe after [Answer]: tag below)

[Answer]: A) Just title, author, status, pages, notes, rating (as specified)

## Question 10
Do you have any specific design or UI preferences?

A) Minimal/clean design (focus on functionality)
B) Modern/colorful design with visual appeal
C) Mobile-first responsive design
D) No preference (developer's choice)
E) Other (please describe after [Answer]: tag below)

[Answer]: B) Modern/colorful design with visual appeal


## Question 11
Should the application support data export/backup?

A) Yes, export to JSON
B) Yes, export to multiple formats (JSON, CSV, PDF)
C) Yes, with automatic backup functionality
D) No export needed
E) Other (please describe after [Answer]: tag below)

[Answer]: A) Yes, export to JSON


## Question 12
What browsers should be supported?

A) Modern browsers only (latest Chrome, Firefox, Safari, Edge)
B) Include older browser versions (IE11, older Safari)
C) Mobile browsers priority (iOS Safari, Chrome Mobile)
D) All browsers with graceful degradation
E) Other (please describe after [Answer]: tag below)

[Answer]: A) Modern browsers only (latest Chrome, Firefox, Safari, Edge)
