# Getting Started

## How to run 

This is a Spring Boot application. To run it execute the main method of com.miro.spelchecker.SpelcheckerApplication. Or: 

```shell
mvn spring-boot:run
```


## Sample GET Request
http://localhost:8080/spellcheck?lang=EN_US&text=hollo%20tere

## Sample Output

{
"_type":"SpellCheck",
"flaggedTokens":[
{
"offset":0,
"token":"hollo",
"type":"UnknownToken",
"suggestions":[
{
"suggestion":"hello",
"score":0.8609481730888449
},
{
"suggestion":"hollow",
"score":0.695921414953466
},
{
"suggestion":"holly",
"score":0.6189701890901528
}
]
},
{
"offset":6,
"token":"tere",
"type":"UnknownToken",
"suggestions":[
{
"suggestion":"there",
"score":0.8609481730888449
},
{
"suggestion":"tree",
"score":0.695921414953466
}
]
}
]
}

