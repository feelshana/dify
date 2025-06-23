from controllers.console.error import InvalidElephantTokenError
from flask import request

def check_supersonic_token():
    # 检查是否存在X-SUPERSONIC-TOKEN请求头
    elephant_token = request.headers.get("X-ELEPHANT-TOKEN")
    if not elephant_token:
        raise InvalidElephantTokenError()