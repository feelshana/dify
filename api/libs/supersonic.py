from controllers.console.error import InvalidElephantTokenError
from flask import request

def check_supersonic_token():
    # 检查是否存在X-ELEPHANT-TOKEN请求头
    elephant_token = request.headers.get("X-ELEPHANT-TOKEN")
    # 如果不存在，则尝试从查询参数中获取
    if not elephant_token:
        elephant_token = request.args.get("_elephant_token")
    if not elephant_token:
        raise InvalidElephantTokenError()