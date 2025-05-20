import os
from http import HTTPStatus
from dashscope import Application
response = Application.call(
    # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    api_key="sk-1cbc18b0ce0148af9fa8c54081281f55",
    app_id='b3a64cafe994432d9e5993d03c104755',# 替换为实际的应用 ID
    prompt='你是谁？')

if response.status_code != HTTPStatus.OK:
    print(f'request_id={response.request_id}')
    print(f'code={response.status_code}')
    print(f'message={response.message}')
    print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
else:
    print(response.output.text)

curl.exe -X POST https://dashscope.aliyuncs.com/api/v1/apps/b3a64cafe994432d9e5993d03c104755/completion \
--header "Authorization: "sk-1cbc18b0ce0148af9fa8c54081281f55" \
--header 'Content-Type: application/json' \
--data '{
    "input": {
        "prompt": "你是谁？"
    },
    "parameters":  {},
    "debug": {}
}' 