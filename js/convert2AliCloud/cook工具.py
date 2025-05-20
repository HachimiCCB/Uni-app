import json
import csv

# 读取 material.js 文件内容
with open('cook.js', 'r', encoding='utf-8') as file:
    materias_data = json.load(file)

# 将每一项的 "name" 键改为 "id"
for item in materias_data:
    item['id'] = item.pop('name')

# 定义 CSV 文件的列名（更新为使用 'id'）
fieldnames = ['id', 'chinese', 'cooker', 'tag', 'withNo','material','time','level','money','from']

# 将数据写入 CSV 文件
with open('cook.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # 写入列名
    writer.writeheader()

    # 写入每一行数据
    for item in materias_data:
        writer.writerow(item)

print("转换完成，已将数据保存为 cook.csv")
