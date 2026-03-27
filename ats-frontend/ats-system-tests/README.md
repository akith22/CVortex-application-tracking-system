# CVortex ATS System Test Automation

Selenium WebDriver + Java + TestNG + Maven automation framework for the CVortex Application Tracking System.

## Tech Stack

- Java 17
- Maven
- Selenium WebDriver
- TestNG
- WebDriverManager
- Extent Reports
- Jackson
- Apache POI
- Java Faker

## Application URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8090`

## Prerequisites

- JDK 17+
- Maven 3.9+
- Node.js / npm
- Chrome installed
- MySQL running with the backend database configured correctly

## Project Location

Automation project path:

```powershell
c:\CVortex_Project\CVortex-application-tracking-system\ats-frontend\ats-system-tests
```

## Configuration

Main automation config file:

```powershell
src\test\resources\config\config.properties
```

Current important values:

- `frontend.base.url=http://localhost:5173`
- `backend.base.url=http://localhost:8090`
- `browser=chrome`
- `headless=false`

## Start the Application

### 1. Start the frontend

```powershell
cd c:\CVortex_Project\CVortex-application-tracking-system\ats-frontend\ats-frontend
npm install
npm run dev
```

### 2. Start the backend

```powershell
cd c:\CVortex_Project\CVortex-application-tracking-system\ats-system
mvn spring-boot:run
```

## Run the Automation Tests

### Run the full suite

```powershell
cd c:\CVortex_Project\CVortex-application-tracking-system\ats-frontend\ats-system-tests
mvn clean test
```

### Compile tests only

```powershell
mvn -DskipTests test-compile
```

### Run a single test class

```powershell
mvn clean test -Dtest=AuthenticationTests
```

Examples:

```powershell
mvn clean test -Dtest=RegisterLoginFlowTests
mvn clean test -Dtest=CandidateModuleTests
mvn clean test -Dtest=RecruiterModuleTests
mvn clean test -Dtest=AdminModuleTests
mvn clean test -Dtest=EndToEndWorkflowTests
```

### Run a single test method

```powershell
mvn clean test -Dtest=RecruiterModuleTests#shouldUpdateApplicationStatus
```

### Run in headless mode

```powershell
mvn clean test -Dheadless=true
```

### Run with a specific browser value

```powershell
mvn clean test -Dbrowser=chrome
```

## Test Suite File

Main suite file:

```powershell
testng.xml
```

Run it explicitly:

```powershell
mvn clean test -DsuiteXmlFile=testng.xml
```

## Generated Reports

### TestNG HTML report

Generated at:

```powershell
target\surefire-reports\index.html
```

Open it:

```powershell
start c:\CVortex_Project\CVortex-application-tracking-system\ats-frontend\ats-system-tests\target\surefire-reports\index.html
```

### Emailable TestNG report

Generated at:

```powershell
target\surefire-reports\emailable-report.html
```

Open it:

```powershell
start c:\CVortex_Project\CVortex-application-tracking-system\ats-frontend\ats-system-tests\target\surefire-reports\emailable-report.html
```

### Extent report

Generated under:

```powershell
reports
```

Open the reports folder:

```powershell
start c:\CVortex_Project\CVortex-application-tracking-system\ats-frontend\ats-system-tests\reports
```

## Current Result

Latest verified full run:

- `39` tests executed
- `39` passed
- `0` failed
- `0` skipped

## Notes

- The framework bootstraps required test users and baseline data automatically.
- Backend must run on port `8090`.
- Frontend must run on port `5173`.
- Chrome CDP warnings for version `146` are warnings only and did not block execution.
