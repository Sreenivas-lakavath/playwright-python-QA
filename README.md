# playwright-python-QA
youtube learning full course

## installation 
` 
pip install pytest-playwright`

playwright install

### Running tests**
Command Line
To run your tests, use the pytest command. This will run your tests on the Chromium browser by default. Tests run in headless mode by default meaning no browser window will be opened while running the tests and results will be seen in the terminal.

pytest

Run tests in headed mode
To run your tests in headed mode, use the --headed flag. This will open up a browser window while running your tests and once finished the browser window will close.

pytest --headed

Run tests on different browsers
To specify which browser you would like to run your tests on, use the --browser flag followed by the name of the browser.

pytest --browser webkit