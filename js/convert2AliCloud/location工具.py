import json
import csv

# 读取 location.js 文件内容
with open('location.js', 'r', encoding='utf-8') as file:
    locations = json.load(file)

# 定义 CSV 文件列名
fieldnames = ['location']

# 写入到 CSV 文件
with open('location.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # 写入列名
    writer.writeheader()

    # 写入每个地点为一行
    for loc in locations:
        writer.writerow({'location': loc})

print("转换完成，已将数据保存为 location.csv")
