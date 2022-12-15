# Build stage
FROM maven:3-amazoncorretto-17 as build

COPY src /home/app/src

COPY pom.xml /home/app

RUN mvn -f /home/app/pom.xml clean package

# Run stage
FROM amazoncorretto:17

EXPOSE 3344

COPY --from=build /home/app/target/miro-spelchecker-0.0.1-SNAPSHOT.jar /usr/local/lib/app.jar

ENTRYPOINT ["java", "-jar", "/usr/local/lib/app.jar"]
