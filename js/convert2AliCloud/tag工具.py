import csv
import re

# 读取 tag.js 文件内容
with open('tag.js', 'r', encoding='utf-8') as file:
    content = file.read()

# 使用正则提取两个数组
arrays = re.findall(r'\[([^\]]+)\]', content)

# 提取饮料词条和烹饪词条
drink_tags = [tag.strip(" '\"\n\t") for tag in arrays[0].split(',')]
cook_tags = [tag.strip(" '\"\n\t") for tag in arrays[1].split(',')]

# 统一长度，短的补空字符串
max_len = max(len(drink_tags), len(cook_tags))
drink_tags += [''] * (max_len - len(drink_tags))
cook_tags += [''] * (max_len - len(cook_tags))

# 写入 CSV 文件
with open('tags.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['drinktag', 'cooktag'])  # 写入表头

    for d, c in zip(drink_tags, cook_tags):
        writer.writerow([d, c])

print("转换完成，已将数据保存为 tags.csv")
