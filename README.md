# SE

# how to run the app
currently on in the main folder of the project (SE)

# ubuntu terminal 0: (main.py)
python3 -m venv venv
source venv/bin/activate
[pip install -r requirements.txt]
python main.py

# ubuntu terminal 1: (mailhog)
source venv/bin/activate
~/go/bin/MailHog

# ubuntu terminal 2: (redis)
redis-server 
[can check if redis is active using redis-cli ping: should return PONG]

# ubuntu terminal 3: (celery worker)
. venv/bin/activate
celery -A main:celery_app worker --loglevel INFO

# ubuntu terminal 4: (celery beat)
. venv/bin/activate
celery -A main:celery_app beat --loglevel INFO

# additional useful commands
celery -A main:celery_app inspect result aed1d564-6d5f-4fdc-b16f-5b62ed204ca4

# Mailhog (in ubuntu)
. venv.bin.activate
python -m pip install protobuf
sudo apt-get update
sudo apt install golang-go
 go get -u github.com/mailhog/MailHog
 ~/go/bin/MailHog

# how to connect and check caching results:
go to the database extension by redis
create a connection - name it if you want, give the databse number as 3
run the app where you have cached results from the apis
check if you can see the cache in database 3 in the connection
it will disappear after the cache times out (40 seconds)

matplotlib==3.8.2