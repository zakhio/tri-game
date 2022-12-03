import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	war
	id("org.springframework.boot") version "3.0.0"
	id("io.spring.dependency-management") version "1.1.0"
	kotlin("jvm") version "1.7.21"
	kotlin("plugin.spring") version "1.7.21"
}

group = "io.zakh"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")

	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-websocket")

	implementation("org.springframework.boot:spring-boot-starter-data-redis")
	implementation("org.springframework.session:spring-session-data-redis")

	implementation("org.springdoc:springdoc-openapi-ui:1.6.13")
	implementation("org.springdoc:springdoc-openapi-kotlin:1.6.13")

	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

	runtimeOnly("io.micrometer:micrometer-registry-influx")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
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
