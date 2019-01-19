## Project Overview: Stage 1

For the **Restaurant Reviews** projects, I have incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, I have take out the static design that lacks accessibility and converted the design to be responsive on different sized displays and accessible for screen reader use. I also added a service worker to begin the process of creating a seamless offline experience for my users.

### How to start the app

1. Start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

    * In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.
   * Note -  For Windows systems, Python 3.x is installed as `python` by default. To start a Python 3.x server, you can simply enter `python -m http.server 8000`.
2. With your server running, visit the site: `http://localhost:8000`, and view all the re
   resturant review. 
3. This web-site is working on the following three areas: 

	* responsive design, 
	* accessibility and 
	* offline use.

4. I wrote code implementing updates to get this site on its way to being a mobile-ready website.

