from controllers.console.error import InvalidElephantTokenError
from configs import dify_config
from flask import request
import requests
import logging

logger = logging.getLogger(__name__)


def check_supersonic_token():
    # 检查是否存在X-ELEPHANT-TOKEN请求头
    elephant_token = request.headers.get("X-ELEPHANT-TOKEN")
    # 如果不存在，则尝试从查询参数中获取
    if not elephant_token:
        elephant_token = request.args.get("_elephant_token")
    if not elephant_token:
        raise InvalidElephantTokenError()
    login_type = request.headers.get("loginType")
    if login_type and login_type == 2:
        logger.info("check redsea token")
        check_redseatoken(elephant_token)

def check_redseatoken(elephant_token):
    if dify_config.REDSEA_TOKEN_URL:
        response = requests.get(
            dify_config.REDSEA_TOKEN_URL,
            headers={"token": elephant_token},
        )
        logger.info("redsea token response: %s", response.text)
        if response.status_code != 200:
            raise InvalidElephantTokenError()
        data = response.json()
        if data.get("code") != 0:
            raise InvalidElephantTokenError()
        if not data.get("data"):
            raise InvalidElephantTokenError()
        if not data.get("data").get("oaAccount"):
            raise InvalidElephantTokenError()
