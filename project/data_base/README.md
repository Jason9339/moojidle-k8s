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

**important**: refer to this [youtube video](https://www.youtube.com/watch?v=DZBGEVgL2eE), to download:
- mongoDB server + shell:
    - [mongoDB for ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
    - [mongoDB for mac](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

1. `sudo systemctl start mongod` if using mac: `brew services start mongodb-community@8.0`
2. `mongosh`
3. `load("the/path/of/your/Schema.js")`
4. `load("the/path/of/your/Seed.js")`