#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import subprocess
import json
from pathlib import Path

# 应用名称常量 - 在这里修改应用名称
APP_NAME = "医药助手"

def get_project_root():
    """获取项目根目录"""
    script_path = Path(os.path.dirname(os.path.realpath(__file__)))
    return script_path.parent

def change_app_name():
    """修改应用名称"""
    project_root = get_project_root()

    # 修改Android应用名称
    try:
        strings_xml_path = project_root / 'android' / 'app' / 'src' / 'main' / 'res' / 'values' / 'strings.xml'

        with open(strings_xml_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 替换应用名称
        updated_content = re.sub(r'<string name="app_name">.*?</string>',
                              f'<string name="app_name">{APP_NAME}</string>',
                              content)

        with open(strings_xml_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        print(f'✅ Android应用名称已修改为: {APP_NAME}')
    except Exception as e:
        print(f'❌ 修改Android应用名称失败: {str(e)}')

    # 修改iOS应用名称
    try:
        info_plist_path = project_root / 'ios' / 'storeverserepoApp' / 'Info.plist'

        with open(info_plist_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 替换CFBundleDisplayName值
        updated_content = re.sub(r'<key>CFBundleDisplayName</key>\s*<string>.*?</string>',
                              f'<key>CFBundleDisplayName</key>\n\t<string>{APP_NAME}</string>',
                              content)

        with open(info_plist_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        print(f'✅ iOS应用名称已修改为: {APP_NAME}')
    except Exception as e:
        print(f'❌ 修改iOS应用名称失败: {str(e)}')

def update_app_icon():
    """更新应用图标"""
    project_root = get_project_root()
    icon_path = project_root / 'src' / 'assets' / 'app_icon.png'

    if not os.path.exists(icon_path):
        print(f'❌ 图标文件不存在: {icon_path}')
        return

    # 更新Android图标
    update_android_icon(icon_path)

    # 更新iOS图标
    update_ios_icon(icon_path)

def update_android_icon(icon_path):
    """更新Android图标"""
    try:
        project_root = get_project_root()
        icon_sizes = {
            'mipmap-mdpi': 48,
            'mipmap-hdpi': 72,
            'mipmap-xhdpi': 96,
            'mipmap-xxhdpi': 144,
            'mipmap-xxxhdpi': 192
        }

        print('📦 开始处理Android图标...')

        # 处理各尺寸图标
        for folder, size in icon_sizes.items():
            output_path = project_root / 'android' / 'app' / 'src' / 'main' / 'res' / folder / 'ic_launcher.png'
            round_output_path = project_root / 'android' / 'app' / 'src' / 'main' / 'res' / folder / 'ic_launcher_round.png'

            try:
                # 调整图标大小
                subprocess.run([
                    'convert',
                    str(icon_path),
                    '-resize', f'{size}x{size}',
                    str(output_path)
                ], check=True)

                # 创建圆形图标
                subprocess.run([
                    'convert',
                    str(icon_path),
                    '-resize', f'{size}x{size}',
                    '-background', 'none',
                    '-vignette', '0x0+0+0',
                    str(round_output_path)
                ], check=True)

                print(f'✅ 已生成 {folder} 图标')
            except Exception as e:
                print(f'❌ 处理 {folder} 图标失败: {str(e)}')

    except Exception as e:
        print(f'❌ 修改Android图标失败: {str(e)}')
        print('请确保已安装ImageMagick')

def update_ios_icon(icon_path):
    """更新iOS图标"""
    try:
        project_root = get_project_root()
        icon_sizes = {
            'Icon-App-20x20@1x.png': 20,
            'Icon-App-20x20@2x.png': 40,
            'Icon-App-20x20@3x.png': 60,
            'Icon-App-29x29@1x.png': 29,
            'Icon-App-29x29@2x.png': 58,
            'Icon-App-29x29@3x.png': 87,
            'Icon-App-40x40@1x.png': 40,
            'Icon-App-40x40@2x.png': 80,
            'Icon-App-40x40@3x.png': 120,
            'Icon-App-60x60@2x.png': 120,
            'Icon-App-60x60@3x.png': 180,
            'Icon-App-76x76@1x.png': 76,
            'Icon-App-76x76@2x.png': 152,
            'Icon-App-83.5x83.5@2x.png': 167,
            'ItunesArtwork@2x.png': 1024
        }

        # 检查iOS图标目录是否存在
        ios_icons_dir = project_root / 'ios' / 'storeverserepoApp' / 'Images.xcassets' / 'AppIcon.appiconset'
        if not os.path.exists(ios_icons_dir):
            os.makedirs(ios_icons_dir)

        print('📦 开始处理iOS图标...')

        # 处理各尺寸图标
        for filename, size in icon_sizes.items():
            output_path = ios_icons_dir / filename

            try:
                # 调整图标大小
                subprocess.run([
                    'convert',
                    str(icon_path),
                    '-resize', f'{size}x{size}',
                    str(output_path)
                ], check=True)

                print(f'✅ 已生成iOS图标: {filename}')
            except Exception as e:
                print(f'❌ 处理iOS图标 {filename} 失败: {str(e)}')

        # 创建Contents.json文件
        contents_json = {
            'images': [],
            'info': {
                'author': 'xcode',
                'version': 1
            }
        }

        for filename, size in icon_sizes.items():
            scale = '1x'
            if '@2x' in filename:
                scale = '2x'
            if '@3x' in filename:
                scale = '3x'

            size_str = filename.replace('Icon-App-', '')
            size_str = re.sub(r'@\d+x\.png$', '', size_str)
            if 'ItunesArtwork@2x' in filename:
                size_str = '1024x1024'

            idiom = 'iphone'
            if '83.5' in filename:
                idiom = 'ipad'
            elif '76' in filename:
                idiom = 'ipad'
            elif 'ItunesArtwork' in filename:
                idiom = 'ios-marketing'

            contents_json['images'].append({
                'filename': filename,
                'idiom': idiom,
                'scale': scale,
                'size': size_str
            })

        # 保存Contents.json
        with open(ios_icons_dir / 'Contents.json', 'w', encoding='utf-8') as f:
            json.dump(contents_json, f, indent=2)

        print('✅ 已更新iOS图标配置文件')

    except Exception as e:
        print(f'❌ 修改iOS图标失败: {str(e)}')
        print('请确保已安装ImageMagick')

def main():
    """主函数"""
    print('🚀 开始更新应用信息...')
    print(f'📝 应用名称: {APP_NAME}')
    print('🖼️ 图标路径: src/assets/app_icon.png')

    # 更新应用名称
    change_app_name()

    # 更新应用图标
    update_app_icon()

    print('✅ 应用信息修改完成!')
    print('📱 请重新构建应用以应用更改:')
    print('   npm run android')
    print('   npm run ios')

if __name__ == '__main__':
    main()
