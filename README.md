# todolist_react
Hi, I'm Ray. My specialized field is real estate investment & management, however, I found some passion in learning programming.  
I had tried using Javascript, HTML, CSS, Node.js, and Express to build a web application.  
Recently, I decided to learn the popular framework "React" by developing this project -- "todolist_react".
## Features
|Functions     |Detail  |URL |
|:--------------:|--------|----|
|login     |1. User can log in using registered email<br>2. User can get a warning message for incorrect password or unregistered account|/todo/login|
|register  |1. User can register by valid email, username, and password<br>2. A warning message will prompt when invalid input occurs|/todo/register|
|view all todos|1. When the User passes the id authentication, the app will navigate to the main page, showing all todos setting by the user<br>2. User can highlight a certain todo|/todo|
|create a todo |1. User can create new todos with detail<br>2. User can get a warning message for invalid input format|/todo/new|
|edit a todo   |1. User can update a certain todo's title & detail<br>2. User can get a warning message for invalid input format|/todo/edit/:id|
|delete a todo |User can delete a certain todo after confirmation|/todo/delete|
## Installation
The following instructions will help you to get a copy of the project and all the settings needed to run it on your local machine.
### Prerequisites
* npm
* node v14.17.0
* Mongodb Atlas account
### Clone
Clone this repository to your local machine :<br>
`$ git clone https://github.com/raindropcity/todolist_react.git`
### Setup Database
#### 1. Create a Mongodb Atlas account<br>
#### 2. Follow the following path :<br>
`./server/config/mongoose.js`<br>
Find the constant "MONGODB_URI" and change the setting of the cloud database URL to yours
### Setup App
#### 1. Go to the project by typing following instruction on your terminal :<br>
`$ cd todolist_react` <br>
#### 2. Install packages :<br>
step1. setup server side packages: `$ npm i`<br>
step2. go to client folder: `$ cd client`<br>
step3. setup client side packages: `$ npm i`<br>
step4. back to root folder: `$ cd ..`<br>
### Launch the server
`$ npm run dev`
### The following message will log on the terminal console when the app launches successfully :
`App is now running on http://localhost:3000`
### Author
Ray Fang