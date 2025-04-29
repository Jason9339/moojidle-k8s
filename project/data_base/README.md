# Data Base Migration

## Description

1. this folder contains:
    - ER model
    - ER mapping
    - Source code of Data Base creation
    - Seed generation code / Seed insert code
2. Data Base being used:
    - [mongoDB](https://www.mongodb.com/)
    - Please first search online for a tutorial on how to install MongoDB on Ubuntu

## Instrcution steps
### Use Terminal
1. `sudo systemctl start mongod`
2. `mongosh`
3. `load("the path of Schema.js")`
4. `load("the path of seed.js")`