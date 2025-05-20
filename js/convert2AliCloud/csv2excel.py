import os
import pandas as pd

# 设置CSV文件所在的目录
input_dir = './'  # 修改为你的目录路径
output_dir = './'  # 输出目录

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)

# 遍历目录下的所有文件
for filename in os.listdir(input_dir):
    if filename.endswith('.csv'):
        csv_path = os.path.join(input_dir, filename)
        xlsx_filename = filename.rsplit('.', 1)[0] + '.xlsx'
        xlsx_path = os.path.join(output_dir, xlsx_filename)

        # 读取CSV并写入为XLSX
        df = pd.read_csv(csv_path)
        df.to_excel(xlsx_path, index=False)

        print(f"已转换: {filename} -> {xlsx_filename}")
