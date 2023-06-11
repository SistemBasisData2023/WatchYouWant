<p align="center">
  <img src="https://github.com/SistemBasisData2023/WatchYouWant/assets/88547347/9e365465-6bc9-4168-9e1d-c8005548403c" width="50%" height= "50%" style="margin: auto;">
</p>

# WatchYouWant

A movie database website implementing NodeJS, PostgreSQL and Express

This project is made by Group Y25 for the final programming assignment in Semester 2022/2023 for course Database System + Lab in Undergraduate of Computer Engineering study program, Department of Electrical Engineering, Faculty of Engineering, Universitas Indonesia. The group consists of:

1. [Armond Harer](https://github.com/ArmondHarer)
2. [Mohamad Farrel Athaillah Nugroho](https://github.com/FarrelAN)
3. [Zefanya Christira Deardo](https://github.com/Zechrs)

___

## Overview

For this project, our group has created a website implementing a SQL-based data system ([`PostgreSQL`](https://www.postgresql.org/)). The front-end utilizes [`ReactJS`](https://react.dev/), while the back-end utilizes [`Node.JS`](https://nodejs.org/en) framework and [`Express`](https://expressjs.com/) to connect it to the front-end. We also use [`TMDB`](https://www.themoviedb.org/), a movie database API which will contain the movie information that will be displayed in the website

Users can register for an account or login to access the website. Once successfully logged in, there are several things the user can do, including:
1. Searching for movies by name or by ID using the search bar 
2. Browsing through a list of movies in the main menu, and accessing the movie information page by clicking on a movie poster
3. Accessing their user information page, containing information about their preferences and displaying a list of their favorite movies
4. Adding movies to their favorites list, giving movies a rating, and discussing with other users using a comment system in the movies information page
5. Logging out

The website utilizes TMDB's database of movies to store detailed information about the movies that will be displayed on WatchYouWant, while the remaining information that are vital to the operation of the website (like user information, comments, movie rating) will be stored in a PostgreSQL database utilizing [`NeonDB`](https://neon.tech/)'s database services

___

## List of Tables

Since WatchYouWant utilizes PostgreSQL (which is a relational database), there are several tables containing information that will be used. Here are the following tables:

### 1. `[Users]`
Contains user information. This table has several attributes, including:
```
1. user_id 
2. username
3. password
4. email
5. fav_movies
```
### 2. `[Movies]`
Contains local movie information. This table has several attributes, including:
```
1. movie_id 
2. title
3. genre
4. rating
```
### 3. `[Comments]`
Contains data used in comment system. This table has several attributes, including:
```
1. comment_id 
2. body
3. user_id
4. movie_id
5. created_at
```
### 4. `[ratings]`
Contains data to be used in the movie rating system. This table has several attributes, including:
```
1. user_id 
2. movie_id
3. rating
```
___
## RELATION TABLE

<details>
<summary> Entity Relationship Diagram (ERD) </summary>
<img src="https://github.com/SistemBasisData2023/WatchYouWant/assets/88547347/8ee4fd13-7b77-434a-9997-9a2331daec71" alt text="Entity Relationship Diagram">
</details>

## UML

<details>
<summary>Unified Modeling Language (UML)</summary>
<img src="https://github.com/SistemBasisData2023/WatchYouWant/assets/88547347/5726ec6c-f40e-48a8-b3c6-b50f29f430a5" alt text="Unified Modeling Language">
</details>

## Flowchart

<details>
<summary>Flowchart</summary>
<img src="https://github.com/SistemBasisData2023/WatchYouWant/assets/88547347/73e1f491-d948-481f-95d9-93ddd2df938d" alt text="Flowchart">
</details>
