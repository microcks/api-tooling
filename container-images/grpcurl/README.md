## Why this image?

While working on Integration Tests for our gRPC mocking features, I was looking for simulating a gRPC client.

Dynamic clients for gRPC are really complex and verbose to setup and I ddin't want to generate (and manage) client stubs within our testing process. I ended up looking at using [grpcurl](https://github.com/fullstorydev/grpcur).

Offical [grpcurl repo](https://github.com/fullstorydev/grpcur) provides container images so the inteent was to use them and to issue `grpcurl` commands using a Testcontainers `GenericContainer`. Unfortunately, the provided container image directly references the `grpcurl` binary as the image entry point and I didn't find any mean to start the image, putting it in a waiting loop and then issuing commands to get the results.

That's why I created this derivative image :wink: 

You can find the result image at `quay.io/microcks/grpcurl:v1.8.9-alpine`.

## How is it working?

You can use this image to start a small container embedding `grpcurl` and then issue commands with Testcontainers:

```java
GenericContainer grpcurl = new GenericContainer("quay.io/microcks/grpcurl:v1.8.9-alpine").withAccessToHost(true);

try {
    grpcurl.start();

    Container.ExecResult result = grpcurl.execInContainer(
        "/bin/grpcurl", "-plaintext", "host.testcontainers.internal:9090", "list");

    assertTrue(result.getStdout().contains("io.github.microcks.grpc.hello.v1.HelloService"));

    result = grpcurl.execInContainer(
        "/bin/grpcurl", "-plaintext", "-d", """
                {"firstname": "Laurent", "lastname": "Broudoux"}
                """,
        "host.testcontainers.internal:9090", "io.github.microcks.grpc.hello.v1.HelloService/greeting");

    assertTrue(result.getStdout().contains("\"greeting\": \"Hello Laurent Broudoux !\""));
} catch (Exception e) {
    fail("No exception should be thrown");
} finally {
    grpcurl.stop();
}
```