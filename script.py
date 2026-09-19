from ratelimit import limits, sleep_and_retry
import requests

url = "http://157.245.207.115/api"

# Allow maximum 100 calls per 1 second
@sleep_and_retry
@limits(calls=100, period=1)
def call_api(url):
    response = requests.get(url)

    print(response.json)

for i in range(1, 101):
    call_api(url)
