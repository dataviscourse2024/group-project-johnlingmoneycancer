# Cancer in Young Adults Visualization - README

## Overview
This project provides an interactive visualization platform to explore increased cancer rates among young adults, focusing on both cancer incidence and mortality. The project uses web technologies, including D3.js, HTML, CSS, and JavaScript, to create an intuitive and visually appealing interface for data exploration.

---

## Components
### 1. **Source Code**
#### **HTML**
- **`mainPage.html`**: Defines the webpage structure, including headers, cancer type images, and containers for visualizations. It integrates CSS for styling and JavaScript for functionality.
    - Contains placeholder links for cancer images to trigger visualizations.
    - Uses semantic elements to enhance accessibility.

#### **CSS**
- **`vis-style.css`**: Provides styling for the interface.
    - Includes responsive design for different screen sizes.
    - Defines hover effects, transitions, and layout adjustments for visualizations and user interactions.

#### **JavaScript**
- **`data-loader.js`**: Handles loading and parsing of CSV datasets using `fetch` and `d3.csvParse`. It organizes data into incidence and mortality categories.
- **`dot-visualization.js`**: Implements a dot-based visualization to represent cancer incidence rates. Highlights affected individuals within a hypothetical population of 100,000.
- **`chart-maker.js`**: Dynamically creates line and bar charts using D3.js.
    - Synchronizes line and bar charts for user-selected data points.
- **`cancer-visualization.js`**: Manages cancer-specific visualizations, including:
    - Displaying line and bar charts.
    - Filtering data by gender, age group, and race.
    - Providing descriptions for each cancer type.

### 2. **Data Files**
This project includes several datasets in CSV format:
- **Incidence Data**:
    - `LeadingCancerIncidence-ALLGROUPS.csv`
    - `LeadingCancerIncidence-COMBINEDAGES.csv`
    - `LeadingCancerIncidence-RACE.csv`
    - `LeadingCancerIncidence-SEX.csv`
    - `LeadingCancerIncidence-YEAR.csv`
- **Mortality Data**:
    - `LeadingCancerMortality-ALLGROUPS.csv`
    - `LeadingCancerMortality-COMBINEDAGES.csv`
    - `LeadingCancerMortality-RACE.csv`
    - `LeadingCancerMortality-SEX.csv`
    - `LeadingCancerMortality-YEAR.csv`

These datasets provide comprehensive details on cancer trends, filtered by attributes such as age, race, and gender.

---

## Libraries and Dependencies
- **D3.js**: Used for creating dynamic and interactive visualizations.
- **Browser Native Features**: JavaScript (ES6+), HTML5, CSS3.

All additional dependencies are included via CDN links, ensuring seamless setup.

---

## URLs
### Project Website
[Hosted Project](#) *(actual project URL)*

### Screencast Videos
[Project Demonstration Video](#) *(screencast URL)*

---

## Features and Usage
1. **Cancer Type Selection**:
   - Click on a cancer image to explore its incidence and mortality trends.
   - Visualizations update dynamically to highlight the selected cancer.

2. **Dot-Based Visualization**:
   - Displays incidence rates using dots, simulating affected individuals in a population of 100,000.

3. **Dynamic Filtering**:
   - Filters data by gender, age group, and race using dropdown menus.
   - Updates charts and visualizations based on selected filters.

4. **Responsive Design**:
   - Adapts layout for optimal viewing on various devices.

5. **Interactive Charts**:
   - Line charts display trends over time.
   - Bar charts provide detailed yearly breakdowns.
   - Hover functionality to emphasize specific data points.

---

## Implementation Notes
1. **Non-Obvious Features**:
   - **Dot Visualization Timing**: Affected dots transition into view with a delay for a smoother animation.
   - **Filter-Dependent Data Loading**: Adjusts datasets dynamically based on user-selected filters.

2. **Data Mapping**:
   - Mappings between cancer types and dataset labels are handled in `cancer-visualization.js` for consistency across visualizations.

3. **Error Handling**:
   - Scripts log errors if datasets or containers are unavailable, ensuring a smoother debugging process.

4. **Customization**:
   - Add more cancer types by extending the `cancerTypeMapping` in `cancer-visualization.js` and updating datasets accordingly.

---

## Setup
1. Clone the repository or download the project files.
2. Ensure all files are in the correct directory structure.
3. Open `mainPage.html` in a browser to launch the application.

---

## Contributors
- **John Chen** *(u1364584)* - [Email](mailto:u1364584@utah.edu)
- **Michael Molenaar** *(u0712166)* - [Email](mailto:u0712166@utah.edu)
