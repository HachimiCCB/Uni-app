import json
import csv

# 读取 npc.js 文件内容
with open('npc.js', 'r', encoding='utf-8') as file:
    npc_data = json.load(file)

# 处理数据
processed_data = []
for item in npc_data:
    new_item = {
        'id': item.pop('name'),
        'chinese': item.get('chinese', ''),
        'tag': ', '.join(filter(None, [item.get('tag', '').strip(), item.get('noTag', '').strip()])),  # 合并 tag 和 noTag
        'money': item.get('money', ''),
        'location': item.get('location', ''),
        'recommendCooks': item.get('recommendCooks', ''),
        'recommendDrinks': item.get('recommendDrinks', ''),
        'rewardCardName': item.get('rewardCard', {}).get('name', ''),
        'rewardCardEffect': item.get('rewardCard', {}).get('effect', ''),
        'punishCardName': item.get('punishCard', {}).get('name', ''),
        'punishCardEffect': item.get('punishCard', {}).get('effect', ''),
    }
    processed_data.append(new_item)

# 定义 CSV 文件的列名
fieldnames = [
    'id', 'chinese', 'tag', 'money', 'location',
    'recommendCooks', 'recommendDrinks',
    'rewardCardName', 'rewardCardEffect',
    'punishCardName', 'punishCardEffect'
]

# 写入 CSV 文件
with open('npc.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for item in processed_data:
        writer.writerow(item)

print("转换完成，已将数据保存为 npc.csv")
