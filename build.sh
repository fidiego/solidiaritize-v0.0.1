echo 'Removing old build directory'
rm -r build
echo 'Generating static site'
python application.py build
echo 'Processing with grunt'
grunt build
