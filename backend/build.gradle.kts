import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	kotlin("jvm") version "1.8.21"
	kotlin("plugin.spring") version "1.8.21"
	kotlin("plugin.serialization") version "1.8.21"

	id("org.springframework.boot") version "3.0.6"
	id("io.spring.dependency-management") version "1.1.0"
	id("org.springdoc.openapi-gradle-plugin") version "1.6.0"
}

group = "io.zakh"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")

	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-websocket")

	implementation("org.springframework.boot:spring-boot-starter-data-redis")
	implementation("org.springframework.session:spring-session-data-redis")

	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")
	implementation("org.springdoc:springdoc-openapi-starter-common:2.1.0")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.15.0")

	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

	runtimeOnly("io.micrometer:micrometer-registry-influx")

	compileOnly("org.springframework.boot:spring-boot-devtools")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.mockito.kotlin:mockito-kotlin:4.1.0")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.register<Copy>("reload") {
	from("src/main/resources")
	into(layout.buildDirectory.dir("resources/main"))

	include("static/**")
}