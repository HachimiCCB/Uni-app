import os
import pandas as pd

# 设置要合并的目录和输出文件名
folder_path = './'  # 可以改为你的目标目录
output_file = 'yqst.xlsx'

# 获取所有 Excel 文件（排除临时文件）
excel_files = [f for f in os.listdir(folder_path) if f.endswith('.xlsx') and not f.startswith('~$')]

merged_data = []

for file in excel_files:
    file_path = os.path.join(folder_path, file)
    df = pd.read_excel(file_path)
    
    # 标准化列名：确保第一列是 id
    df.columns = df.columns.astype(str)
    df.rename(columns={df.columns[0]: 'id'}, inplace=True)

    # 添加类型列（文件名去除扩展名）
    df.insert(1, 'type', os.path.splitext(file)[0])
    
    merged_data.append(df)

# 合并所有 DataFrame（自动对齐列名，不同列名会保留）
final_df = pd.concat(merged_data, ignore_index=True)

# 输出到 Excel
final_df.to_excel(output_file, index=False)

print(f"合并完成，输出文件为：{output_file}")
