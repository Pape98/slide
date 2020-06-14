# Slide Organization Management System

## Background 

Quick overview of project's context, problem, and my proposed solution.

### Context

SLIDE (Sophomore Leaders Impacting, Developing, and Impacting) is a sophomore organization at Texas A&M that promotes student leadership by tackling many issues on campus and in our community that often go unspoken such as mental health and sexual assault. The organization is composed of approximately 115 students, including both staff and general members. The organization keeps members accountable by having a point system where each event corresponds to a certain number of points. Each member to get a certain number of service and social points in order to avoid being placed on probation the following semester. Moreover, members have to appeal events they are going to miss.


### Problem

Members submitted their points online through a google form and they could view their total number of points on google a åspreasheet. However, that spreadsheet was not private and anyone could see the points of other people. Also, members had to sign in during meetings on a piece of paper which would eventually be lost. Members submitted their appeals on a google form but there was no way to know if staff actually approved it or not. Even when staff reached a decision, they would send an email to the person that appealed but there was no guarantee that he or she was going to see it.


### Solution

As a member of the organization, I was able to witness all of the challenges. This first-hand experience allowed me to get a better idea on how to tackle those challenges. As a result, I decided to develop a web application that would serve as an organization management system. All of the tasks that used to be done manually or through party services would be done on a single interface.
### Link to Site

https://tamuslide.herokuapp.com/home

### Video of Solution

<a href="http://www.youtube.com/watch?feature=player_embedded&v=IZYbIqmAtJQ
" target="_blank"><img src="http://img.youtube.com/vi/IZYbIqmAtJQ/0.jpg" 
alt="solution's video" border="10" width="700" height="500" /></a>


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system. The login information is provided below for testing purposes:

***Staff Login:***
```
  - username: 987654321
  - password: staff
```
***Member Login:***
```
  - username: 12345678
  - password: test
```


### Prerequisites

Make sure you have Node.js installed on your machine. It can be downloaded [here]( https://nodejs.org/en/download/)

### Installing
```
git clone https://github.com/Pape98/Slide-Website.git
cd Slide-Website
npm install
npm start
```
Access website on localhost with the port number printed on terminal (usually 3000).
### Features

General members have the ability to:
  - login to a private account
  - submit points and check status
  - create and sign up for events
  - sign of up volunteering shifts
  - submit appeals and check status
  - check their lunch buddies
  - search for a specific application
  - add new keywords

Staff members have the ability to:
  - login to a private account
  - review point and appeal submissions
  - check meeting attendance
  - check people are not meeting their points
  - post google forms within the interface

## Built With

* [NodeJS](https://rubyonrails.org/)
* [Semantic UI](https://semmntic-ui.com/)
* [MongoDB]()
* [Express]()

## Authors

 *Pape Sow Traore* - (https://github.com/Pape98)
