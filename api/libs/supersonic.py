import json
import requests

from configs import dify_config
from controllers.console.error import InvalidSupersonicTokenError
from flask import request, session

def check_supersonic_token():
    # 检查是否存在X-SUPERSONIC-TOKEN请求头
    supersonic_token = request.headers.get("X-SUPERSONIC-TOKEN")
    if not supersonic_token:
        raise InvalidSupersonicTokenError()
    if session.get("supersonic_user"):
        return True
    # 配置认证头和API端点
    auth_header = {"Authorization": f"Bearer {supersonic_token}"}
    api_url = f"{dify_config.SUPERSONIC_URL}/api/auth/user/getCurrentUser"
    try:
        response = requests.get(api_url, headers=auth_header)
        response.raise_for_status()
        result = json.loads(response.content)
        user = result["data"]
        userName = user["name"]
        if not userName:
            raise InvalidSupersonicTokenError()
        # 将用户名存入session中
        session["supersonic_user"] = userName
    except (requests.exceptions.RequestException, ValueError, KeyError, TypeError, json.JSONDecodeError):
        raise InvalidSupersonicTokenError()